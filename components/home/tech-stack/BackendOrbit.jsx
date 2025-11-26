"use client";

import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";

export default function BackendOrbit({ hovered, coreRef, backendTech }) {
  const groupRef = useRef();
  const logoRefs = useRef([]);
  const orbitRef = useRef();
  const radius = 2.8;
  const [blinkPhase, setBlinkPhase] = useState(0);
  const activationTimeRef = useRef(0);

  useEffect(() => {
    if (hovered) {
      setBlinkPhase(0);
      activationTimeRef.current = Date.now();
    }
  }, [hovered]);

  useFrame((state) => {
    if (!hovered) return;

    // Blink animation timing
    const elapsed = Date.now() - activationTimeRef.current;
    if (elapsed < 150) {
      setBlinkPhase(1);
    } else if (elapsed < 300) {
      setBlinkPhase(0);
    } else if (elapsed < 450) {
      setBlinkPhase(2);
    } else if (elapsed < 600) {
      setBlinkPhase(0);
    } else {
      setBlinkPhase(3);
    }

    const rotation = state.clock.elapsedTime * 0.3;

    // Update orbit circle opacity
    if (orbitRef.current) {
      orbitRef.current.style.opacity = blinkPhase === 0 ? "0" : "1";
    }

    // Update each logo position manually to keep them facing camera
    logoRefs.current.forEach((ref, i) => {
      if (ref) {
        const angle = (i / backendTech.length) * Math.PI * 2 + rotation;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // Keep logos in 2D plane (z=0) and always facing camera
        ref.style.transform = `translate(-50%, -50%) translate(${x * 50}px, ${
          -y * 50
        }px)`;
        // Logos are always visible once orbit appears (after blinks)
        ref.style.opacity = blinkPhase === 3 ? "1" : "0";
      }
    });
  });

  if (!hovered) return null;

  return (
    <Html center position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
      <div style={{ position: "relative", width: 0, height: 0 }}>
        {/* Orbit circle */}
        <div
          ref={orbitRef}
          className="absolute rounded-full pointer-events-none transition-opacity duration-100"
          style={{
            width: `${radius * 100}px`,
            height: `${radius * 100}px`,
            border: "2px solid rgba(255, 140, 0, 0.6)",
            boxShadow:
              "0 0 15px rgba(255, 140, 0, 0.5), inset 0 0 15px rgba(255, 140, 0, 0.3)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0,
          }}
        />

        {backendTech.map((tech, i) => {
          const angle = (i / backendTech.length) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={i}
              ref={(el) => (logoRefs.current[i] = el)}
              className="rounded-full flex items-center justify-center pointer-events-none transition-opacity duration-200 overflow-hidden absolute"
              style={{
                width: "70px",
                height: "70px",
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(255, 140, 0, 0.9)",
                boxShadow:
                  "0 0 20px rgba(255, 140, 0, 0.8), inset 0 0 10px rgba(255, 140, 0, 0.4)",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${x * 50}px, ${
                  -y * 50
                }px)`,
                opacity: 0,
              }}
            >
              <img
                src={tech.icon}
                alt={tech.name}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            </div>
          );
        })}
      </div>
    </Html>
  );
}
