"use client";

import { useMemo } from "react";
import * as THREE from "three";
import ShatterMesh from "./ShatterMesh";

export default function ShatterShell({ hovered, shellHovered }) {
  const topGeo = useMemo(() => new THREE.ConeGeometry(1.5, 3, 8, 2), []);
  const bottomGeo = topGeo;

  return (
    <group>
      {/* top pyramid */}
      <group position={[0, 1.5, 0]}>
        <ShatterMesh
          geometry={topGeo}
          color={shellHovered ? "#4A90E2" : "#9090e0"}
          hovered={hovered}
          shellHovered={shellHovered}
          explodeDistance={1.8}
        />
      </group>

      {/* bottom pyramid */}
      <group position={[0, -1.7, 0]} rotation={[Math.PI, 0, 0]}>
        <ShatterMesh
          geometry={bottomGeo}
          color={shellHovered ? "#5B8FCC" : "#6040a0"}
          hovered={hovered}
          shellHovered={shellHovered}
          explodeDistance={1.8}
        />
      </group>
    </group>
  );
}
