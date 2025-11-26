"use client";

import { useEffect } from "react";
import Image from "next/image";
import { XIcon, CaretLeftIcon, CaretRightIcon } from "../PhosphorIcons";

export default function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  setCurrentIndex,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !images) return null;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200 cursor-zoom-out"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors z-210 p-2 bg-black/50 rounded-full hover:bg-white/10 border border-white/10"
      >
        <XIcon size={32} />
      </button>

      <div
        className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full drop-shadow-2xl">
          <Image
            src={images[currentIndex].url}
            alt="Experience detail full"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-colors z-210 bg-black/50 rounded-full hover:bg-white/10 backdrop-blur-md border border-white/10"
            >
              <CaretLeftIcon size={32} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-colors z-210 bg-black/50 rounded-full hover:bg-white/10 backdrop-blur-md border border-white/10"
            >
              <CaretRightIcon size={32} />
            </button>

            {/* Dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-white scale-125"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
