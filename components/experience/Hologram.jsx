"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CaretLeftIcon,
  CaretRightIcon,
  ArrowsOutSimpleIcon,
  LinkIcon,
} from "../PhosphorIcons";

export default function Hologram({
  activeExperience,
  isTransitioning,
  currentImageIndex,
  setCurrentImageIndex,
  setIsImageModalOpen,
  UI_TEXT,
  formatDate,
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    if (!activeExperience?.photo) return;
    setCurrentImageIndex((prev) => (prev + 1) % activeExperience.photo.length);
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    if (!activeExperience?.photo) return;
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + activeExperience.photo.length) %
        activeExperience.photo.length
    );
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <div
      className={`
        hologram-container
        rounded-xl border-b
        h-[65vh] mt-5 md:h-auto
        ${isTransitioning ? "animate-hologram-transition" : "opacity-95"}
      `}
      style={{
        boxShadow: "0 0 40px rgba(96, 165, 250, 0.1)",
      }}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(transparent_50%,rgba(96,165,250,0.05)_50%)] bg-size-[100%_4px] animate-scan" />

      {/* Top Bar Decoration */}
      <div className="h-6 border-b border-blue-400/20 bg-blue-900/10 flex items-center px-4 justify-between shrink-0">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
        </div>
        <div className="text-[10px] font-mono text-blue-400/60 tracking-widest">
          {UI_TEXT.SECURE_CONNECTION}
          {activeExperience.id
            ? activeExperience.id.toString().slice(-4)
            : "0000"}
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 relative z-10 h-[calc(100%)] overflow-y-auto md:overflow-visible">
        {/* Column 1: Tech Stack & Meta */}
        <div className="flex flex-col gap-4 md:gap-6 border-b md:border-b-0 md:border-r border-blue-400/20 pb-6 md:pb-0 md:pr-6 shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">
              {activeExperience.title}
            </h2>
            <p className="text-blue-400 font-mono text-sm font-bold">
              {activeExperience.entity}
            </p>
            <p className="text-gray-500 text-xxs md:text-xs mt-1">
              {formatDate(activeExperience.startDate)} -{" "}
              {formatDate(activeExperience.endDate)}
            </p>
          </div>

          <div className="space-y-3 mt-auto hidden md:block">
            {activeExperience.website && (
              <a
                href={activeExperience.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors w-fit mb-4"
              >
                <LinkIcon size={14} />
                <span className="font-mono underline decoration-blue-400/30 underline-offset-4">
                  Visit Website
                </span>
              </a>
            )}
            <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
              {activeExperience.skill?.length > 0 ? "Skills" : ""}
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeExperience.skill &&
                activeExperience.skill.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-[10px] bg-blue-500/10 border border-blue-500/30 rounded text-blue-300"
                  >
                    {t}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Column 2: Description */}
        <div className="border-b mb-4 md:border-b-0 md:border-r border-blue-400/20 pb-6 md:pb-0 md:pr-6 overflow-y-auto custom-scrollbar max-h-[45vh] md:max-h-[255.74px]">
          <p className="text-sm leading-relaxed pr-4 text-gray-300 whitespace-pre-line">
            {activeExperience.description}
          </p>
        </div>

        {/* Column 3: Image Carousel */}
        <div className="flex flex-col justify-center pb-12 md:pb-0 h-full min-h-[250px]">
          {activeExperience.photo && activeExperience.photo.length > 0 ? (
            <div
              className="relative w-full h-full rounded-lg overflow-hidden border border-blue-400/20 group cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={activeExperience.photo[currentImageIndex].url}
                alt="Experience detail"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain bg-black/40 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

              {/* Expand Icon Hint */}
              <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowsOutSimpleIcon size={16} className="text-white" />
              </div>

              {/* Carousel Controls */}
              {activeExperience.photo.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-blue-500/50 transition-colors z-10"
                  >
                    <CaretLeftIcon size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-blue-500/50 transition-colors z-10"
                  >
                    <CaretRightIcon size={20} />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {activeExperience.photo.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-colors shadow-sm ${
                          idx === currentImageIndex ? "bg-white" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full rounded-lg border border-blue-400/10 bg-blue-900/5 flex items-center justify-center text-blue-400/30 text-xs font-mono">
              NO_IMAGE_DATA
            </div>
          )}
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-400"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-400"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-400"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-400"></div>
    </div>
  );
}
