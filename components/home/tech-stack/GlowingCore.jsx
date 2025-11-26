"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function GlowingCore({
  hovered,
  coreHovered,
  onCoreHover,
  coreRef,
}) {
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (!coreRef.current) return;

    // Rotate clockwise on Y-axis (vertical through apex)
    coreRef.current.rotation.y -= 0.02;

    // Pulse effect while maintaining thin tall shape - smaller size
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    coreRef.current.scale.set(0.35 * pulse, 1.3 * pulse, 0.35 * pulse);

    // Smooth color transitions
    if (materialRef.current) {
      const targetColor = new THREE.Color(
        coreHovered ? "#FF8C00" : hovered ? "#00C9FF" : "#C44EC7"
      );
      materialRef.current.color.lerp(targetColor, delta * 3);

      const targetEmissive = new THREE.Color(
        coreHovered ? "#FF6600" : hovered ? "#7FE7FF" : "#D16BE6"
      );
      materialRef.current.emissive.lerp(targetEmissive, delta * 3);

      const targetEmissiveIntensity = coreHovered ? 2.5 : hovered ? 2.0 : 1.2;
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        targetEmissiveIntensity,
        delta * 3
      );

      const targetOpacity = hovered ? 1 : 0.7;
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        targetOpacity,
        delta * 3
      );
    }
  });

  return (
    <group>
      <mesh
        ref={coreRef}
        renderOrder={999}
        onPointerOver={() => onCoreHover(true)}
        onPointerOut={() => onCoreHover(false)}
      >
        <octahedronGeometry args={[1.2]} />
        <meshStandardMaterial
          ref={materialRef}
          roughness={0.3}
          metalness={0.8}
          transparent
          depthTest={false}
          flatShading
        />
      </mesh>

      {/* Multiple directional lights to highlight different faces */}
      <directionalLight
        position={[2, 0.5, 2]}
        intensity={coreHovered ? 2 : 1}
        color={coreHovered ? "#FF7F00" : hovered ? "#00C9FF" : "#C44EC7"}
        target={coreRef.current}
      />
      <directionalLight
        position={[-2, 0.5, -2]}
        intensity={coreHovered ? 2 : 1}
        color={coreHovered ? "#CC5500" : "#D8B56C"}
        target={coreRef.current}
      />
      <directionalLight
        position={[0, 1, 0]}
        intensity={coreHovered ? 1.5 : 0.8}
        color={coreHovered ? "#FF6600" : "#CFAF60"}
        target={coreRef.current}
      />
      <directionalLight
        position={[0, -1, 0]}
        intensity={coreHovered ? 1.5 : 0.8}
        color="#C9A959"
        target={coreRef.current}
      />

      {/* Core glow */}
      <pointLight
        color="#D8B56C"
        intensity={coreHovered ? 3 : 2}
        distance={8}
      />
      <pointLight
        color="#CFAF60"
        intensity={coreHovered ? 2 : 1}
        distance={5}
      />
    </group>
  );
}
