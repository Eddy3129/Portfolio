"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import EthereumLogo from "./tech-stack/EthereumLogo";
import { frontendTech, backendTech } from "./tech-stack/techData";

export default function TechStack() {
  const [hoverState, setHoverState] = useState(null);

  const getInspectText = () => {
    if (hoverState === "core") {
      return {
        text: "[ INNER CORE - BACKEND STACK ]",
        color: "#FF8C00",
        techs: backendTech,
      };
    } else if (hoverState === "shell") {
      return {
        text: "[ OUTER SHELL - FRONTEND STACK ]",
        color: "#61DAFB",
        techs: frontendTech,
      };
    }
    return {
      text: "[ HOVER TO INSPECT STACK ]",
      color: "#9CA3AF",
      techs: null,
    };
  };

  const inspectInfo = getInspectText();

  return (
    <div
      id="stack"
      className="flex flex-col items-center justify-center h-[600px] w-full"
    >
      <div className="tech-stack-visual hidden md:block">
        <div className="eth-wrapper-3d">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <directionalLight position={[-5, -5, -5]} intensity={0.4} />
              <pointLight
                position={[0, 0, 5]}
                intensity={0.8}
                color="#8B7DD8"
              />
              <EthereumLogo
                onHoverChange={setHoverState}
                frontendTech={frontendTech}
                backendTech={backendTech}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 mt-5 min-h-[100px] w-full">
        <div
          className="font-mono text-xs text-center transition-all duration-300"
          style={{
            color: inspectInfo.color,
            textShadow: hoverState ? `0 0 10px ${inspectInfo.color}` : "none",
            fontWeight: hoverState ? "700" : "400",
          }}
        >
          {inspectInfo.text}
        </div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 justify-items-center transition-all duration-300 min-h-[30px]">
          {inspectInfo.techs &&
            inspectInfo.techs.map((tech, i) => (
              <span
                key={i}
                className="font-mono text-[10px] px-2 py-1 rounded transition-all duration-200 text-center min-w-[70px]"
                style={{
                  color: inspectInfo.color,
                  border: `1px solid ${inspectInfo.color}40`,
                  background: `${inspectInfo.color}10`,
                  boxShadow: `0 0 8px ${inspectInfo.color}30`,
                }}
              >
                {tech.name}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
