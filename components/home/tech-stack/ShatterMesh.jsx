"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function ShatterMesh({
  geometry,
  color,
  hovered,
  shellHovered,
  explodeDistance = 1.5,
}) {
  const group = useRef();
  const shards = useMemo(() => {
    const g = geometry.clone().toNonIndexed();
    const pos = g.attributes.position;
    const shardData = [];

    for (let i = 0; i < pos.count; i += 3) {
      const shardGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array(9);

      // copy 3 vertices (triangle)
      for (let v = 0; v < 3; v++) {
        vertices[v * 3 + 0] = pos.getX(i + v);
        vertices[v * 3 + 1] = pos.getY(i + v);
        vertices[v * 3 + 2] = pos.getZ(i + v);
      }

      shardGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      shardGeo.computeBoundingSphere();

      const center = shardGeo.boundingSphere.center.clone();

      // move geometry so its origin is at its center
      const matrix = new THREE.Matrix4().makeTranslation(
        -center.x,
        -center.y,
        -center.z
      );
      shardGeo.applyMatrix4(matrix);

      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 1,
        (Math.random() - 0.5) * 1,
        (Math.random() - 0.5) * 1
      );

      shardData.push({ geometry: shardGeo, origin: center, dir, rotSpeed });
    }

    return shardData;
  }, [geometry]);

  const progressRef = useRef(0);
  const rotationsRef = useRef([]);

  // Shared material for all shards to enable smooth transitions
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        transparent: true,
        roughness: 0.6,
        metalness: 0.2,
        flatShading: true,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered ? 1 : 0;
    // smooth approach to target - slower speed
    progressRef.current += (target - progressRef.current) * delta * 1.5;
    const p = progressRef.current;

    // Smooth color transition
    const targetColor = new THREE.Color(color);
    material.color.lerp(targetColor, delta * 3);

    const targetEmissive = new THREE.Color(shellHovered ? color : "#000000");
    material.emissive.lerp(targetEmissive, delta * 3);

    const targetOpacity = shellHovered ? 0.5 : 0.4;
    material.opacity = THREE.MathUtils.lerp(
      material.opacity,
      targetOpacity,
      delta * 3
    );

    const targetEmissiveIntensity = shellHovered ? 0.2 : 0;
    material.emissiveIntensity = THREE.MathUtils.lerp(
      material.emissiveIntensity,
      targetEmissiveIntensity,
      delta * 3
    );

    // Initialize rotations array if needed
    if (rotationsRef.current.length !== shards.length) {
      rotationsRef.current = shards.map(() => new THREE.Euler(0, 0, 0));
    }

    group.current.children.forEach((child, i) => {
      const mesh = child;
      const data = shards[i];
      if (!mesh || !data) return;

      // move from origin along dir
      const pos = new THREE.Vector3().copy(data.origin);
      pos.addScaledVector(data.dir, p * explodeDistance);
      mesh.position.copy(pos);

      // Smooth rotation that scales with progress
      rotationsRef.current[i].x += data.rotSpeed.x * delta * p;
      rotationsRef.current[i].y += data.rotSpeed.y * delta * p;
      rotationsRef.current[i].z += data.rotSpeed.z * delta * p;

      // Lerp rotation back to zero when reassembling
      mesh.rotation.x = THREE.MathUtils.lerp(
        mesh.rotation.x,
        rotationsRef.current[i].x * p,
        0.1
      );
      mesh.rotation.y = THREE.MathUtils.lerp(
        mesh.rotation.y,
        rotationsRef.current[i].y * p,
        0.1
      );
      mesh.rotation.z = THREE.MathUtils.lerp(
        mesh.rotation.z,
        rotationsRef.current[i].z * p,
        0.1
      );
    });
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i} geometry={s.geometry} material={material} />
      ))}
    </group>
  );
}
