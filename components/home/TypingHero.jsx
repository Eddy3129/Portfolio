"use client";

import { useState, useEffect } from "react";

const LINE_1 = "Hi there, I'm";
const LINE_2 = "Eddy Lim.";

export default function TypingHero() {
  const [text, setText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    let currentText = "";
    const fullText = LINE_1 + "\n" + LINE_2;

    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        const char = fullText[currentIndex];
        currentText += char;
        setText(currentText);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    return () => {
      clearInterval(typeInterval);
    };
  }, []);

  // Split the text back into lines for rendering
  const splitText = text.split("\n");
  const renderLine1 = splitText[0] || "";
  const renderLine2 = splitText[1] !== undefined ? splitText[1] : "";

  // Determine if we are on the second line to apply the gradient class
  const isSecondLineVisible = text.includes("\n");

  return (
    <h1 className="text-5xl md:text-7xl font-bold leading-tight min-h-[3.5em] md:min-h-[3em]">
      {renderLine1}
      {isSecondLineVisible && <br />}
      <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-gray-400 to-gray-600">
        {renderLine2}
      </span>
      <span className="text-neon-green animate-pulse">_</span>
    </h1>
  );
}
