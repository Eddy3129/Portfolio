"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import ShatterShell from "./ShatterShell";
import GlowingCore from "./GlowingCore";
import OrbitalShard from "./OrbitalShard";
import BackendOrbit from "./BackendOrbit";
import DebrisField from "./DebrisField";

export default function EthereumLogo({
  onHoverChange,
  frontendTech,
  backendTech,
}) {
  const groupRef = useRef();
  const coreRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [delayedHover, setDelayedHover] = useState(false);
  const [coreHovered, setCoreHovered] = useState(false);

  // clean delayedHover handling
  useEffect(() => {
    if (hovered) {
      const id = setTimeout(() => setDelayedHover(true), 150);
      return () => clearTimeout(id);
    } else {
      setDelayedHover(false);
    }
  }, [hovered]);

  // Notify parent of hover state changes
  useEffect(() => {
    if (coreHovered) {
      onHoverChange("core");
    } else if (delayedHover) {
      onHoverChange("shell");
    } else {
      onHoverChange(null);
    }
  }, [coreHovered, delayedHover, onHoverChange]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Always rotate
    groupRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        // Cycle states on click for mobile: Idle -> Shell -> Core -> Idle
        if (!hovered) {
          setHovered(true);
        } else if (!coreHovered) {
          setCoreHovered(true);
        } else {
          setHovered(false);
          setCoreHovered(false);
        }
      }}
    >
      {/* Shattering outer shell */}
      <ShatterShell
        hovered={coreHovered}
        shellHovered={delayedHover && !coreHovered}
      />

      {/* Glowing inner core */}
      <GlowingCore
        hovered={delayedHover}
        coreHovered={coreHovered}
        onCoreHover={setCoreHovered}
        coreRef={coreRef}
      />

      {/* Orbiting frontend tech shards */}
      {!coreHovered &&
        frontendTech.map((tech, i) => (
          <OrbitalShard
            key={i}
            index={i}
            total={frontendTech.length}
            hovered={delayedHover}
            tech={tech}
          />
        ))}

      {/* Backend logos orbiting around core - only on core hover */}
      <BackendOrbit
        hovered={coreHovered}
        coreRef={coreRef}
        backendTech={backendTech}
      />

      {/* Ambient debris field - show on shell hover or core hover */}
      <DebrisField hovered={delayedHover} />
    </group>
  );
}
