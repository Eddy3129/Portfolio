"use client";

import { useState } from "react";
import Image from "next/image";

// Parent must be `relative` with a set size (both call sites are).
// next/image is lazy by default, so React won't hold navigation commits waiting on it.
export default function ProjectImage({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (error) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      className={className}
      onError={() => setError(true)}
    />
  );
}
