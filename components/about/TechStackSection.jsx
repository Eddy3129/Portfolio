"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export function StackCard({ item, color }) {
  const { name, icon, link } = item;
  const content = (
    <div
      className="group flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-neon-green/50 transition-all duration-200 w-full"
      style={{ borderColor: color ? `${color}50` : undefined }}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-100 relative overflow-hidden shrink-0">
        <Image src={icon} alt="" fill className="object-contain p-1" sizes="32px" />
      </div>
      <span className="font-mono text-sm font-medium text-gray-300 group-hover:text-white truncate">
        {name}
      </span>
    </div>
  );

  return link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full hover:translate-x-1 transition-transform"
    >
      {content}
    </a>
  ) : (
    content
  );
}

export default function TechStackSection({ columns }) {
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  const stackScrollRef = useRef(null);

  const handleScroll = () => {
    if (stackScrollRef.current) {
      const { scrollLeft, clientWidth } = stackScrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveStackIndex(index);
    }
  };

  return (
    <div className="relative">
      <div
        ref={stackScrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-6 items-start pb-6 lg:pb-0 no-scrollbar"
      >
        {columns.map((col, index) => (
          <div key={index} className="w-full shrink-0 snap-center">
            {/* Column Title */}
            <div className="flex items-center gap-2 mb-4">
              {col.icon && <span className="text-xl">{col.icon}</span>}
              <h4 className="text-base font-bold font-sans text-white">
                {col.title}
              </h4>
            </div>

            {/* List of Items (Rows) */}
            <div className="flex flex-col gap-3">
              {col.items.map((item) => {
                return (
                  <StackCard key={item.name} item={item} color={col.color} />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Indicators */}
      <div className="flex lg:hidden justify-center gap-2 absolute left-0 right-0">
        {columns.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === activeStackIndex ? "w-8 bg-neon-green" : "w-2 bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
