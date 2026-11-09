"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AsciiRenderer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Head scan: "Lee Perry-Smith" by Infinite-Realities, CC BY 3.0 (via three.js examples)
const HEAD_URL = "/models/head.glb";

const COUNT = 16000; // particles per shape (all shapes share the count so they can morph)
const HOLD = 4.2; // seconds a shape rests after landing
const MORPH = 2.2; // seconds of liquid transition
const RADIUS = 2.55; // base bounding-sphere radius, times each shape's scale
const TRAIL = 8; // cursor trail samples fed to the shader (wake behind the pointer)

/* ---------- geometry: true 3D solids ---------- */

const clean = (g) => {
  const n = g.index ? g.toNonIndexed() : g.clone();
  for (const key of Object.keys(n.attributes)) {
    if (key !== "position" && key !== "normal") n.deleteAttribute(key);
  }
  return n;
};
// Each top-level entry is one moving part (a geometry or array of geometries).
// The part index rides along in the `color` attribute so the sampler hands it back per particle.
// `weights` (per part, default 1) scale particle density so big flat areas don't hog particles.
const merge = (groups, weights = []) =>
  mergeGeometries(
    groups.flatMap((group, id) =>
      [group].flat().map((g) => {
        const n = clean(g);
        const count = n.attributes.position.count;
        n.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3).fill(id), 3));
        n.setAttribute("weight", new THREE.BufferAttribute(new Float32Array(count).fill(weights[id] ?? 1), 1));
        return n;
      })
    )
  );

const ORBIT_TILT = 0.35; // DeFi token ring tilt (radians about Z); shader uses the same axis

function ethGeometry() {
  // Proportions from the official 256x417 mark, 1 unit = 128px:
  // diamond top y=0, equator 212, bottom 288; chevron rim 237, notch 312, tip 417.
  const y = (px) => (208 - px) / 128;
  const cone = (h, centre, open = false) => {
    const g = new THREE.ConeGeometry(1, h, 4, 1, open);
    g.rotateX(Math.PI); // apex down
    g.translate(0, centre, 0);
    return g;
  };
  const upper = new THREE.ConeGeometry(1, y(0) - y(212), 4); // apex up
  upper.translate(0, (y(0) + y(212)) / 2, 0);
  const lower = cone(y(212) - y(288), (y(212) + y(288)) / 2);
  const outer = cone(y(237) - y(417), (y(237) + y(417)) / 2, true);
  const inner = cone(y(237) - y(312), (y(237) + y(312)) / 2, true);
  // DeFi: tokens orbiting the mark on a tilted ring (liquidity flowing around the protocol)
  const R = 1.55;
  const ring = new THREE.TorusGeometry(R, 0.025, 6, 120);
  ring.rotateX(Math.PI / 2);
  const tokens = [0, 1, 2].map((i) => {
    const phi = (i * 2 * Math.PI) / 3;
    const coin = new THREE.CylinderGeometry(0.3, 0.3, 0.07, 32);
    coin.rotateX(Math.PI / 2); // face outward along the radius
    coin.rotateY(Math.PI / 2 - phi);
    coin.translate(R * Math.cos(phi), 0, R * Math.sin(phi));
    return coin;
  });
  const orbit = [ring, ...tokens];
  orbit.forEach((g) => g.rotateZ(ORBIT_TILT));
  const g = merge([[upper, lower, outer, inner], orbit]);
  g.userData.pivots = [new THREE.Vector3()]; // orbit centre
  return g;
}

const box = (w, h, d, x, y, z = 0) => {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
};

function panel(y, w = 1.4, depth = 0.1) {
  // rounded-square slab
  const rr = w * 0.2;
  const sh = new THREE.Shape();
  sh.moveTo(-w + rr, -w);
  sh.lineTo(w - rr, -w);
  sh.absarc(w - rr, -w + rr, rr, -Math.PI / 2, 0);
  sh.lineTo(w, w - rr);
  sh.absarc(w - rr, w - rr, rr, 0, Math.PI / 2);
  sh.lineTo(-w + rr, w);
  sh.absarc(-w + rr, w - rr, rr, Math.PI / 2, Math.PI);
  sh.lineTo(-w, -w + rr);
  sh.absarc(-w + rr, -w + rr, rr, Math.PI, Math.PI * 1.5);
  const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false, curveSegments: 8 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, y, 0);
  return g;
}

function stackGeometry() {
  // isometric data-centre diorama: circuit platform, server towers, databases, chip, floating code
  // parts: 0 platform, 1 towers, 2 databases, 3 traces, 4-6 code panels, 7 chip
  const cyl = (r, h, x, y, z, seg = 32) => {
    const c = new THREE.CylinderGeometry(r, r, h, seg);
    c.translate(x, y + h / 2, z);
    return c;
  };
  const platform = [panel(-0.15, 2.3, 0.15)];
  [[0.95, 0.95], [1.2, 1.25]].forEach(([x, z], i) => {
    for (let k = 0; k < 3 - i; k++) platform.push(box(0.24, 0.24, 0.24, x, 0.12 + k * 0.27, z)); // cube stacks
  });

  const towers = [[0.5, -1.0], [1.5, -0.05]].flatMap(([x, z]) => {
    const t = [box(0.9, 2.9, 0.9, x, 1.45, z)];
    for (let k = 0; k < 10; k++) {
      const y = 0.3 + k * 0.27;
      t.push(box(0.72, 0.06, 0.05, x, y, z + 0.47)); // rack units, front face
      t.push(box(0.05, 0.06, 0.72, x + 0.47, y, z)); // and side face
    }
    for (const rad of [0.3, 0.15]) {
      const fan = new THREE.TorusGeometry(rad, 0.04, 8, 32);
      fan.rotateX(Math.PI / 2);
      fan.translate(x, 2.92, z);
      t.push(fan);
    }
    return t;
  });

  const dbs = [[-1.45, -0.9, 3], [-0.65, -1.55, 2], [-1.6, 0.35, 1], [0.25, 1.35, 2], [1.65, 1.4, 1]].flatMap(
    ([x, z, n]) => Array.from({ length: n }, (_, k) => cyl(0.38, 0.24, x, k * 0.3, z))
  );

  const seg = (x1, z1, x2, z2) =>
    box(Math.abs(x2 - x1) + 0.05, 0.03, Math.abs(z2 - z1) + 0.05, (x1 + x2) / 2, 0.015, (z1 + z2) / 2);
  const C = [-0.4, 0.4]; // chip
  const traces = [
    seg(C[0], C[1], -1.45, C[1]), seg(-1.45, C[1], -1.45, -0.9),
    seg(C[0], C[1], C[0], -1.55), seg(C[0], -1.55, -0.65, -1.55),
    seg(C[0], C[1], 0.5, C[1]), seg(0.5, C[1], 0.5, -0.55),
    seg(0.5, C[1], 1.5, C[1]),
    seg(C[0], C[1], C[0], 1.35), seg(C[0], 1.35, 0.25, 1.35),
    seg(-1.6, 0.35, -1.6, 1.6), seg(1.65, 1.4, 1.65, 0.45),
  ];

  const code = [[-1.5, 2.2, -1.2, 0.5], [-0.3, 3.1, -1.8, 0.2], [2.1, 2.5, 1.0, -0.9]].map(([x, y, z, rot]) => {
    const pane = [box(1.0, 0.7, 0.03, 0, 0, 0)];
    [0.6, 0.4, 0.7, 0.3].forEach((len, i) =>
      pane.push(box(len, 0.06, 0.03, -0.4 + len / 2 + (i % 2) * 0.1, 0.22 - i * 0.15, 0.03))
    );
    pane.forEach((g) => g.rotateY(rot).translate(x, y, z));
    return pane;
  });

  const chip = [
    box(1.0, 0.12, 1.0, C[0], 0.06, C[1]),
    box(0.55, 0.1, 0.55, C[0], 0.17, C[1]),
    ...[0.16, 0.3, 0.44].map((y) => cyl(0.16, 0.08, C[0], y, C[1])), // holo DB on the chip
  ];
  return merge([platform, towers, dbs, traces, ...code, chip], [0.3, 1.5, 1.8, 2.5, 1.2, 1.2, 1.2, 1.5]);
}

function automationGeometry() {
  // robot arm: base, turret, two links with joints, gripper
  // parts: 0 base, 1 upper arm, 2 forearm, 3/4 fingers
  const parts = [[], [], [], [], []];
  let at = 0;
  const cyl = (r, h, x, y, alongZ = false) => {
    const g = new THREE.CylinderGeometry(r, r, h, 24);
    if (alongZ) g.rotateX(Math.PI / 2);
    g.translate(x, y, 0);
    parts[at].push(g);
  };
  const link = ([ax, ay], [bx, by], w) => {
    const dx = bx - ax, dy = by - ay;
    const g = new THREE.BoxGeometry(w, Math.hypot(dx, dy), w);
    g.rotateZ(Math.atan2(-dx, dy));
    g.translate((ax + bx) / 2, (ay + by) / 2, 0);
    parts[at].push(g);
  };
  const S = [0, -0.85], E = [-0.78, 0.77], W = [0.72, 0.22];
  cyl(0.9, 0.3, 0, -1.6); // base
  cyl(0.5, 0.5, 0, -1.2); // turret
  at = 1;
  cyl(0.35, 0.8, ...S, true); // shoulder
  link(S, E, 0.4);
  at = 2;
  cyl(0.3, 0.7, ...E, true); // elbow
  link(E, W, 0.32);
  cyl(0.22, 0.6, ...W, true); // wrist
  at = 3;
  link([W[0] - 0.15, W[1]], [W[0] - 0.15, W[1] - 0.6], 0.1); // fingers
  at = 4;
  link([W[0] + 0.15, W[1]], [W[0] + 0.15, W[1] - 0.6], 0.1);
  const g = merge(parts);
  g.userData.pivots = [new THREE.Vector3(...S, 0), new THREE.Vector3(...E, 0)];
  return g;
}

function headGeometry(scene) {
  scene.updateMatrixWorld(true);
  const parts = [];
  scene.traverse((o) => {
    if (o.isMesh) parts.push(o.geometry.clone().applyMatrix4(o.matrixWorld));
  });
  return merge([parts]); // one rigid part
}

function normalise(g, scale) {
  g.computeBoundingBox();
  const centre = g.boundingBox.getCenter(new THREE.Vector3());
  g.translate(-centre.x, -centre.y, -centre.z);
  g.computeBoundingSphere();
  const k = (RADIUS * scale) / g.boundingSphere.radius;
  g.scale(k, k, k);
  for (const v of g.userData.pivots ?? []) v.sub(centre).multiplyScalar(k);
  return g;
}

function samplePoints(geometry, shape) {
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).setWeightAttribute("weight").build();
  const pos = new Float32Array(COUNT * 3);
  const nor = new Float32Array(COUNT * 3);
  const part = new Float32Array(COUNT);
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < COUNT; i++) {
    sampler.sample(p, n, c);
    p.toArray(pos, i * 3);
    n.toArray(nor, i * 3);
    part[i] = shape * 8 + Math.round(c.r); // shader decodes shape + part
  }
  return { pos, nor, part, pivots: geometry.userData.pivots ?? [] };
}

// view tilt per shape (radians); the stack is seen from ~31° above, the classic isometric read
const TILT = [0.12, 0.12, 0.55, 0.12];

export const CONCEPTS = [
  { label: "Artificial Intelligence", color: "#7dd3fc" },
  { label: "Web3 / DeFi", color: "#c4b5fd" },
  { label: "Full Stack Engineering", color: "#5effc0" },
  { label: "Automation", color: "#fcd34d" },
];

/* ---------- liquid morph shader ---------- */

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform vec3 uTrail[${TRAIL}]; // xy = pointer in NDC, z = strength (decays with age, grows with speed)
  attribute vec3 aTo;
  attribute vec3 aNor;
  attribute vec3 aNorTo;
  attribute float aRand;
  attribute float aPart;   // shape * 8 + part
  attribute float aPartTo;
  uniform vec3 uPivot[3];  // 0 DeFi orbit centre, 1 arm shoulder, 2 arm elbow
  varying float vLight;

  mat3 rot(vec3 a, float ang) { // axis-angle (Rodrigues)
    a = normalize(a);
    float s = sin(ang), c = cos(ang), o = 1.0 - c;
    return mat3(
      o * a.x * a.x + c,       o * a.x * a.y + a.z * s, o * a.z * a.x - a.y * s,
      o * a.x * a.y - a.z * s, o * a.y * a.y + c,       o * a.y * a.z + a.x * s,
      o * a.z * a.x + a.y * s, o * a.y * a.z - a.x * s, o * a.z * a.z + c
    );
  }
  void spin(inout vec3 p, inout vec3 n, vec3 pivot, vec3 axis, float ang) {
    mat3 r = rot(axis, ang);
    p = pivot + r * (p - pivot);
    n = r * n;
  }

  // per-part motion while a shape is on screen; returns extra glow
  float animate(inout vec3 p, inout vec3 n, float id) {
    float shape = floor(id / 8.0 + 0.01);
    float part = id - shape * 8.0;
    float t = uTime;
    float glow = 0.0;
    if (shape < 0.5) {                                   // AI: looks around, thought-scan ripples up
      float band = smoothstep(0.4, 0.0, abs(p.y - (mod(t * 1.6, 8.0) - 4.0)));
      p += n * band * 0.09;
      glow = band * 0.9 + step(0.985, fract(aRand * 91.7 + t * 0.6)) * 0.8; // scan + neural sparks
      spin(p, n, vec3(0.0), vec3(0.0, 1.0, 0.0), sin(t * 0.7) * 0.35);
      spin(p, n, vec3(0.0), vec3(1.0, 0.0, 0.0), sin(t * 1.1) * 0.15);
    } else if (shape < 1.5) {                            // DeFi: mark bobs, tokens orbit
      if (part < 0.5) p.y += sin(t * 1.4) * 0.12;
      else spin(p, n, uPivot[0], vec3(-sin(${ORBIT_TILT}), cos(${ORBIT_TILT}), 0.0), t * 0.9);
    } else if (shape < 2.5) {                            // Full stack: servers hum, data flows, code floats
      if (part > 0.5 && part < 1.5) glow = smoothstep(0.12, 0.0, abs(fract(p.y * 0.6 - t * 0.5) - 0.5)) * 0.6;
      else if (part > 1.5 && part < 2.5) glow = (sin(t * 2.0 + p.x * 2.0 + p.z) * 0.5 + 0.5) * 0.35;
      else if (part > 2.5 && part < 3.5) glow = smoothstep(0.15, 0.0, abs(fract((abs(p.x) + abs(p.z)) * 0.5 - t * 0.6) - 0.5)) * 1.2;
      else if (part > 3.5 && part < 6.5) p.y += sin(t * 1.3 + part * 1.7) * 0.1;
      else if (part > 6.5) glow = (sin(t * 3.0) * 0.5 + 0.5) * 0.5;
    } else {                                             // Automation: arm lifts, gripper opens/closes
      float w = t * 1.3;
      if (part > 2.5) p.x += (part < 3.5 ? -1.0 : 1.0) * (sin(w * 2.0) * 0.5 + 0.5) * 0.08;
      if (part > 1.5) spin(p, n, uPivot[2], vec3(0.0, 0.0, 1.0), sin(w + 1.2) * 0.4);
      if (part > 0.5) spin(p, n, uPivot[1], vec3(0.0, 0.0, 1.0), sin(w) * 0.25);
    }
    return glow;
  }

  // flow field: particles swirl like liquid mid-morph
  vec3 flow(vec3 p, float t) {
    return vec3(
      sin(p.y * 2.1 + t) + sin(p.z * 1.7 - t * 1.3),
      sin(p.z * 2.3 + t * 1.1) + sin(p.x * 1.9 + t),
      sin(p.x * 2.2 - t * 0.9) + sin(p.y * 1.6 + t * 1.2)
    );
  }

  void main() {
    float delay = aRand * 0.4;                        // stagger: the shape melts unevenly
    float p = clamp((uProgress - delay) / 0.6, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    float swirl = sin(p * 3.14159);                   // 0 at rest, 1 mid-flight

    // both ends keep moving mid-morph, so the flow blends two live poses
    vec3 a = position, na = aNor, b = aTo, nb = aNorTo;
    float glow = mix(animate(a, na, aPart), animate(b, nb, aPartTo), p);
    vec3 pos = mix(a, b, p);
    pos += flow(pos * 1.2, uTime * 1.6) * 0.32 * swirl;

    vec3 n = normalize(mix(na, nb, p) + 1e-4);
    vec3 vn = normalize(normalMatrix * n);
    float lit = clamp(dot(vn, normalize(vec3(0.45, 0.6, 0.75))), 0.0, 1.0);
    vLight = mix(0.3 + pow(lit, 0.8) * 0.7, 0.85, swirl * 0.55);
    vLight = min(1.0, vLight + glow * (1.0 - swirl));

    // finger through liquid: each trail sample is a small brush; together they leave a wake
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    vec2 push = vec2(0.0);
    float heat = 0.0;
    for (int i = 0; i < ${TRAIL}; i++) {
      vec2 d = ndc - uTrail[i].xy;
      float f = smoothstep(0.16, 0.0, length(d)) * uTrail[i].z;
      push += normalize(d + 1e-4) * f;
      heat += f;
    }
    // only the surface facing the viewer reacts, and each grain by its own amount
    float k = smoothstep(-0.2, 0.5, vn.z) * (0.4 + aRand * 1.2);
    heat = min(heat, 1.5) * k;
    mv.xy += push * k * 0.3;
    mv.xyz += vn * heat * 0.25; // bulge outward along the surface normal
    vLight = min(1.0, vLight + heat * 0.5);

    gl_PointSize = 5.0; // big enough to close gaps: AsciiEffect averages each cell
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vLight;
  void main() {
    if (length(gl_PointCoord - 0.5) > 0.5) discard;
    gl_FragColor = vec4(vec3(vLight), 1.0);
  }
`;

function Particles({ target, still, onLanded, pointer }) {
  const { scene } = useGLTF(HEAD_URL);
  const shapes = useMemo(
    () =>
      [
        [headGeometry(scene), 1.5],
        [ethGeometry(), 1],
        [stackGeometry(), 1.2],
        [automationGeometry(), 1],
      ].map(([g, scale], shape) => samplePoints(normalise(g, scale), shape)),
    [scene]
  );

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // deterministic per-particle stagger (render must stay pure)
    const rand = new Float32Array(COUNT).map((_, i) => {
      const x = Math.sin(i * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    });
    g.setAttribute("position", new THREE.BufferAttribute(shapes[0].pos.slice(), 3));
    g.setAttribute("aTo", new THREE.BufferAttribute(shapes[0].pos.slice(), 3));
    g.setAttribute("aNor", new THREE.BufferAttribute(shapes[0].nor.slice(), 3));
    g.setAttribute("aNorTo", new THREE.BufferAttribute(shapes[0].nor.slice(), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    g.setAttribute("aPart", new THREE.BufferAttribute(shapes[0].part.slice(), 1));
    g.setAttribute("aPartTo", new THREE.BufferAttribute(shapes[0].part.slice(), 1));
    return g;
  }, [shapes]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 1 },
      uTime: { value: 0 },
      uTrail: { value: Array.from({ length: TRAIL }, () => new THREE.Vector3(9, 9, 0)) },
      uPivot: { value: [shapes[1].pivots[0], ...shapes[3].pivots] },
    }),
    [shapes]
  );
  // three.js objects are mutated through refs, never through memoised values
  const group = useRef();
  const points = useRef();
  const material = useRef();
  const current = useRef(0);
  const last = useRef({ x: 9, y: 9, t: 0 }); // previous pointer + time since last trail shift

  // start a morph whenever the target changes
  useEffect(() => {
    if (target === current.current || !points.current) return;
    const a = points.current.geometry.attributes;
    a.position.array.set(shapes[current.current].pos);
    a.aNor.array.set(shapes[current.current].nor);
    a.aTo.array.set(shapes[target].pos);
    a.aNorTo.array.set(shapes[target].nor);
    a.aPart.array.set(shapes[current.current].part);
    a.aPartTo.array.set(shapes[target].part);
    for (const k of ["position", "aNor", "aTo", "aNorTo", "aPart", "aPartTo"]) a[k].needsUpdate = true;
    material.current.uniforms.uProgress.value = still ? 1 : 0;
    current.current = target;
  }, [target, shapes, still]);

  useFrame((_, dt) => {
    const u = material.current.uniforms;
    u.uTime.value += dt;
    if (u.uProgress.value < 1) {
      u.uProgress.value = Math.min(1, u.uProgress.value + dt / MORPH);
      if (u.uProgress.value === 1) onLanded();
    }
    // hover trail: shift every ~33ms so the wake spans ~250ms; strength fades with age
    const { x, y, inside } = pointer.current;
    const trail = u.uTrail.value;
    const l = last.current;
    for (const t of trail) t.setZ(t.z * Math.exp(-dt * 5));
    if ((l.t += dt) > 0.033) {
      l.t = 0;
      for (let i = TRAIL - 1; i > 0; i--) trail[i].copy(trail[i - 1]);
    }
    if (inside) {
      const speed = l.x === 9 ? 0 : Math.hypot(x - l.x, y - l.y) / Math.max(dt, 1e-3);
      const want = 0.35 + Math.min(speed * 0.15, 0.65); // resting cursor still dents, fast swipe splashes
      trail[0].set(x, y, THREE.MathUtils.damp(trail[0].z, want, 12, dt));
    }
    l.x = inside ? x : 9;
    l.y = inside ? y : 9;
    const g = group.current;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, TILT[current.current] - (inside ? y * 0.35 : 0), 4, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, inside ? x * 0.25 : 0, 4, dt);
    if (!still) g.rotation.y += dt * (inside ? 0.2 : 0.45); // full 360° turn, slows on hover
  });

  return (
    <group ref={group} rotation={[0.12, 0, 0]}>
      {/* per-shape scale + hover bulge exceed any fixed bounds; skip culling */}
      <points ref={points} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader} fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </points>
    </group>
  );
}

export default function AsciiScene() {
  const [index, setIndex] = useState(0);
  const [still, setStill] = useState(false);
  const [landedAt, setLandedAt] = useState(0); // bumps each time a morph lands
  const pointer = useRef({ x: 9, y: 9, inside: false });
  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: -((e.clientY - r.top) / r.height) * 2 + 1,
      inside: true,
    };
  };
  const { color, label } = CONCEPTS[index];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // rest on each shape for HOLD seconds after it lands, then flow to the next
  useEffect(() => {
    if (still) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % CONCEPTS.length), HOLD * 1000);
    return () => clearTimeout(id);
  }, [index, landedAt, still]);

  return (
    <div className="flex flex-col items-center justify-center h-[640px] w-full">
      <div
        className="ascii-art relative w-full max-w-[560px] aspect-square"
        aria-hidden="true"
        onPointerMove={onPointerMove}
        onPointerLeave={() => (pointer.current = { ...pointer.current, inside: false })}
      >
        <Canvas camera={{ position: [0, 0, 12.6], fov: 25 }} /* long lens: near-isometric, same framing */ dpr={1}>
          {/* opaque black: AsciiEffect reads transparent pixels as white */}
          <color attach="background" args={["black"]} />
          <Suspense fallback={null}>
            <Particles
              target={index}
              still={still}
              pointer={pointer}
              onLanded={() => setLandedAt(Date.now())}
            />
          </Suspense>
          <AsciiRenderer fgColor={color} bgColor="transparent" characters=" .:-+*=%@#" resolution={0.26} />
        </Canvas>
      </div>

      <p
        className="mt-10 font-mono text-xs uppercase tracking-[0.25em] transition-colors duration-1000"
        style={{ color }}
      >
        [ {label} ]
      </p>
    </div>
  );
}
