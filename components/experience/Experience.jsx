"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { CaretLeftIcon, CaretRightIcon } from "../PhosphorIcons";
import Hologram from "./Hologram";
import ImageModal from "./ImageModal";

const UI_TEXT = {
  HEADER: "EXPERIENCE",
  PAST_LABEL: "Past - Scroll Left",
  PRESENT_LABEL: "Present - Scroll Right",
  SECURE_CONNECTION: "SECURE CONNECTION // ID-",
};

export default function Experience({ initialExperiences = [] }) {
  // Reverse the experiences so that Oldest is Left, Newest is Right (Present)
  const experiences = useMemo(
    () => [...initialExperiences].reverse(),
    [initialExperiences]
  );

  // Default to the last item (Newest/Present)
  const [activeId, setActiveId] = useState(
    experiences.length > 0 ? experiences[experiences.length - 1].id : null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const scrollRef = useRef(null);
  const isAutoScrolling = useRef(false);
  const wheelAccumulator = useRef(0);

  const activeExperience = useMemo(
    () => experiences.find((e) => e.id === activeId) || experiences[0],
    [activeId, experiences]
  );

  // Reset image index when active experience changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeId]);

  // Ensure we always have a valid index for rendering, even before the effect runs
  const safeCurrentIndex =
    activeExperience?.photo && currentImageIndex < activeExperience.photo.length
      ? currentImageIndex
      : 0;

  // Initial scroll to active card (Rightmost)
  useEffect(() => {
    if (activeId) {
      const timer = setTimeout(() => {
        scrollToCenter(activeId);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []); // Run once on mount

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 600);
    return () => clearTimeout(timer);
  }, [activeId]);

  const scrollToCenter = useCallback((id) => {
    const container = scrollRef.current;
    const element = document.getElementById(`card-${id}`);
    if (!container || !element) return;

    isAutoScrolling.current = true;

    const containerCenter = container.clientWidth / 2;
    const elementCenter = element.offsetLeft + element.clientWidth / 2;
    const targetScrollLeft = elementCenter - containerCenter;

    const start = container.scrollLeft;
    const change = targetScrollLeft - start;
    const duration = 500;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const ease = (t) => --t * t * t + 1;
      const run = ease(Math.min(timeElapsed / duration, 1));

      container.scrollLeft = start + change * run;

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        isAutoScrolling.current = false;
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  const handlePrev = useCallback(() => {
    const currentIndex = experiences.findIndex((e) => e.id === activeId);
    if (currentIndex > 0) {
      const newId = experiences[currentIndex - 1].id;
      setActiveId(newId);
      scrollToCenter(newId);
    }
  }, [experiences, activeId, scrollToCenter]);

  const handleNext = useCallback(() => {
    const currentIndex = experiences.findIndex((e) => e.id === activeId);
    if (currentIndex < experiences.length - 1) {
      const newId = experiences[currentIndex + 1].id;
      setActiveId(newId);
      scrollToCenter(newId);
    }
  }, [experiences, activeId, scrollToCenter]);

  // Handle Wheel for Discrete Card Switching
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e) => {
        e.preventDefault();
        wheelAccumulator.current += e.deltaY;
        const threshold = 100;

        if (wheelAccumulator.current > threshold) {
          handleNext();
          wheelAccumulator.current = 0;
        } else if (wheelAccumulator.current < -threshold) {
          handlePrev();
          wheelAccumulator.current = 0;
        }

        if (window.wheelTimeout) clearTimeout(window.wheelTimeout);
        window.wheelTimeout = setTimeout(() => {
          wheelAccumulator.current = 0;
        }, 100);
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, [activeId]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isAutoScrolling.current) return;
    if (window.scrollEndTimeout) clearTimeout(window.scrollEndTimeout);

    window.scrollEndTimeout = setTimeout(() => {
      const container = scrollRef.current;
      const center = container.scrollLeft + container.clientWidth / 2;
      let closest = null;
      let minDiff = Infinity;

      Array.from(container.children).forEach((child) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const diff = Math.abs(childCenter - center);
        if (diff < minDiff) {
          minDiff = diff;
          closest = child;
        }
      });

      if (closest) {
        const id = closest.id.replace("card-", "");
        if (id !== activeId) {
          setActiveId(id);
          scrollToCenter(id);
        }
      }
    }, 150);
  }, [activeId, scrollToCenter]);

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (!experiences || experiences.length === 0) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <div className="experience-container">
      {/* Top Carousel (HUD) */}
      <div className="w-full z-30 pt-24 bg-linear-to-b from-black/90 to-transparent relative shrink-0 flex justify-center">
        {/* Vertical Header (Left Side) */}
        <div className="absolute left-4 md:left-12 top-40 hidden lg:flex flex-col items-center gap-4 z-40 opacity-90">
          <div className="h-32 w-px bg-linear-to-b from-transparent via-blue-400 to-transparent"></div>
          <h1 className="text-4xl md:text-5xl font-bold font-mono bg-clip-text bg-linear-to-b text-white [writing-mode:vertical-rl] rotate-180 tracking-widest">
            {UI_TEXT.HEADER}
            <span className="text-blue-300">_</span>
          </h1>
        </div>

        {/* Directional Arrows */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 -translate-y-1/2 left-4 md:left-10 flex items-center gap-2 text-blue-400 hover:text-blue-300 z-20 transition-colors cursor-pointer"
        >
          <CaretLeftIcon size={24} />
          <span className="text-[10px] font-mono uppercase tracking-widest hidden md:inline">
            {UI_TEXT.PAST_LABEL}
          </span>
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 -translate-y-1/2 right-4 md:right-10 flex items-center gap-2 text-blue-400 hover:text-blue-300 z-20 transition-colors cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest hidden md:inline">
            {UI_TEXT.PRESENT_LABEL}
          </span>
          <CaretRightIcon size={24} />
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-4 px-[calc(50%)] no-scrollbar py-4 items-center max-w-3xl mx-auto mask-linear-fade snap-mandatory"
        >
          {experiences.map((exp) => {
            const isActive = activeId === exp.id;
            const bgImage =
              exp.photo && exp.photo.length > 0 ? exp.photo[0].url : null;

            return (
              <div
                key={exp.id}
                id={`card-${exp.id}`}
                onClick={() => {
                  setActiveId(exp.id);
                  scrollToCenter(exp.id);
                }}
                className={`
                    experience-card relative overflow-hidden snap-center
                    ${
                      isActive
                        ? "experience-card-active"
                        : "experience-card-inactive"
                    }
                    `}
              >
                {/* Background Image */}
                {bgImage && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={bgImage}
                      alt={exp.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className={`object-cover transition-opacity ${
                        isActive
                          ? "opacity-100"
                          : "opacity-50 group-hover:opacity-70"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 transition-colors ${
                        isActive ? "bg-black/20" : "bg-black/60"
                      }`}
                    />
                  </div>
                )}

                <div className="relative z-10 flex flex-col items-center justify-center h-full p-2">
                  <h3
                    className={`text-xs font-bold text-center transition-colors drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${
                      isActive
                        ? "text-white"
                        : "text-gray-200 group-hover:text-white"
                    }`}
                  >
                    {exp.title}
                  </h3>
                  <span className="text-[10px] text-gray-300 font-mono mt-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-400 shadow-[0_0_8px_#60a5fa] z-20" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-end justify-center pb-0 overflow-hidden">
        {/* Humanoid Image (Fixed Bottom) */}
        <div className="fixed bottom-[-20vh] left-0 w-full z-10 pointer-events-none flex items-end justify-center">
          <div className="relative w-full max-w-8xl h-screen">
            <Image
              src="/humanoid.svg"
              alt="AI Humanoid"
              fill
              sizes="100vw"
              className="object-bottom object-contain opacity-80 drop-shadow-[0_0_50px_rgba(96,165,250,0.15)]"
              priority
            />
          </div>
        </div>

        {/* Hologram Container */}
        <div className="fixed bottom-[8vh] top-[29%] md:top-[27%] w-[85%] left-1/2 -translate-x-1/2 md:w-full md:max-w-6xl px-0 md:px-6 z-60">
          <Hologram
            activeExperience={activeExperience}
            isTransitioning={isTransitioning}
            currentImageIndex={safeCurrentIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            setIsImageModalOpen={setIsImageModalOpen}
            UI_TEXT={UI_TEXT}
            formatDate={formatDate}
          />
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={activeExperience?.photo}
        currentIndex={safeCurrentIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      {/* Global Styles */}
    </div>
  );
}
