"use client";

import { startTransition, useState, ViewTransition } from "react";

const TABS = [
  { id: "story", label: "My Story" },
  { id: "skills", label: "My Skills" },
];

// Panels are server-rendered and passed in; only the switch is client-side.
export default function AboutTabs({ story, skills }) {
  const [active, setActive] = useState("story");
  const panels = { story, skills };
  const activeIndex = TABS.findIndex((t) => t.id === active);

  // startTransition lets <ViewTransition> below crossfade the panels.
  const select = (id) => startTransition(() => setActive(id));

  const onKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = TABS[(activeIndex + step + TABS.length) % TABS.length];
    select(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <>
      <div className="flex justify-center mb-12">
        <div
          role="tablist"
          aria-label="About sections"
          onKeyDown={onKeyDown}
          className="relative inline-grid grid-cols-2 p-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          {/* Sliding highlight (plain CSS, works without View Transitions) */}
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-neon-green shadow-[0_0_20px_rgba(0,255,157,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {TABS.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(tab.id)}
                className={`relative z-10 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${
                  selected ? "text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <ViewTransition key={active} enter="tab-in" exit="tab-out" default="none">
        <div
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
        >
          {panels[active]}
        </div>
      </ViewTransition>
    </>
  );
}
