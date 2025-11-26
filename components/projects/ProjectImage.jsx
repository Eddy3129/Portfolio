"use client";

import { useState } from "react";

export default function ProjectImage({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (error) {
    return null; // Or return a fallback placeholder
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
