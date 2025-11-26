"use client";

import { useState, useRef } from "react";
import Image from "next/image";

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
        id="tech-stack-section"
        ref={stackScrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x mx-2 snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-8 items-start border-t border-white/10 pb-6 md:pb-0 no-scrollbar"
      >
        {columns.map((col, index) => (
          <div key={index} className="w-full shrink-0 snap-center px-1 md:px-0">
            {/* Column Title */}
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
              {col.icon && <span className="text-xl">{col.icon}</span>}
              <h4 className="text-lg font-bold font-sans text-white">
                {col.title}
              </h4>
            </div>

            {/* List of Items (Rows) */}
            <div className="flex flex-col gap-3">
              {col.items.map((item, i) => {
                const isObject = typeof item === "object";
                const name = isObject ? item.name : item;
                const icon = isObject ? item.icon : null;
                const link = isObject ? item.link : null;

                const CardContent = (
                  <div
                    className="group flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-neon-green/50 transition-all duration-200 w-full"
                    style={{
                      borderColor: col.color ? `${col.color}50` : undefined,
                    }}
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-100 relative overflow-hidden">
                      {icon ? (
                        <Image
                          src={icon}
                          alt={name}
                          fill
                          className="object-contain p-1"
                          sizes="32px"
                        />
                      ) : (
                        <span className="text-xs text-gray-500 font-bold">
                          {name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <span className="font-mono text-sm font-medium text-gray-300 group-hover:text-white truncate">
                      {name}
                    </span>
                  </div>
                );

                return link ? (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full hover:translate-x-1 transition-transform"
                  >
                    {CardContent}
                  </a>
                ) : (
                  <div key={i} className="w-full">
                    {CardContent}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Indicators */}
      <div className="flex md:hidden justify-center gap-2 absolute left-0 right-0">
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
