"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function DebrisField({ hovered }) {
  const instancedMeshRef = useRef();
  const count = 40;

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      temp.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius
        ),
        speed: 0.3 + Math.random() * 0.3,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!instancedMeshRef.current || !hovered) return;

    const matrix = new THREE.Matrix4();
    particles.forEach((particle, i) => {
      const angle =
        (i / count) * Math.PI * 2 + state.clock.elapsedTime * particle.speed;
      const radius = 2.5 + Math.sin(state.clock.elapsedTime + i) * 0.5;

      matrix.setPosition(
        Math.cos(angle) * radius,
        particle.position.y + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1,
        Math.sin(angle) * radius
      );

      instancedMeshRef.current.setMatrixAt(i, matrix);
    });
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!hovered) return null;

  return (
    <instancedMesh ref={instancedMeshRef} args={[null, null, count]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial
        color="#6B7280"
        transparent
        opacity={0.4}
        emissive="#4B5563"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}
