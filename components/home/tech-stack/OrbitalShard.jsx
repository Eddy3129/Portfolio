"use client";

import { useFrame } from "@react-three/fiber";
import { Html, Billboard } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

export default function OrbitalShard({ index, total, hovered, tech }) {
  const meshRef = useRef();
  const [localHover, setLocalHover] = useState(false);
  const [occluded, setOccluded] = useState(false);
  const isTopOrbit = index < total / 2;

  // Initial position on pyramid surface
  const initialPos = useMemo(() => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 0.6;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      isTopOrbit ? 1.5 : -1.7,
      Math.sin(angle) * radius
    );
  }, [index, total, isTopOrbit]);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (hovered) {
      // Circular orbital revolution hugging the core
      const orbitSpeed = 1; // faster than shell spin so motion is noticeable
      const angle =
        (index / total) * Math.PI * 2 + state.clock.elapsedTime * orbitSpeed;
      const radius = 3.0;
      const orbitHeight = isTopOrbit ? 0.6 : -0.6;

      meshRef.current.position.set(
        Math.cos(angle) * radius,
        orbitHeight,
        Math.sin(angle) * radius
      );

      // Rotate shard
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.015;
    } else {
      // Return to pyramid surface with reduced rotation
      meshRef.current.position.lerp(initialPos, 0.08);
      meshRef.current.rotation.x *= 0.95;
      meshRef.current.rotation.y *= 0.95;
    }
  });

  return (
    <mesh
      ref={meshRef}
      renderOrder={500}
      onPointerOver={() => setLocalHover(true)}
      onPointerOut={() => setLocalHover(false)}
    >
      <boxGeometry args={[0.15, 0.15, 0.05]} />
      <meshStandardMaterial
        color={tech.color}
        transparent
        opacity={hovered ? 0.3 : 0}
        emissive={tech.color}
        emissiveIntensity={localHover ? 0.8 : 0.3}
        metalness={0.6}
        roughness={0.4}
      />
      {hovered && (
        <Billboard>
          <Html
            transform
            occlude
            onOcclude={setOccluded}
            distanceFactor={4}
            position={[0, 0, 0.2]}
            style={{
              transition: "opacity 0.2s",
              opacity: occluded ? 0.2 : 1,
            }}
          >
            <div
              className={`rounded-full flex items-center justify-center pointer-events-none transition-all overflow-hidden ${
                localHover ? "scale-125" : "scale-100"
              }`}
              style={{
                width: "70px",
                height: "70px",
                background: `${tech.color}20`,
                border: `2px solid ${tech.color}`,
                boxShadow: `0 0 ${localHover ? "20px" : "15px"} ${
                  tech.color
                }, inset 0 0 10px ${tech.color}40`,
              }}
            >
              <img
                src={tech.icon}
                alt={tech.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  filter: tech.name === "Next.js" ? "invert(1)" : "none",
                }}
              />
            </div>
          </Html>
        </Billboard>
      )}
    </mesh>
  );
}
