"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  GithubLogoIcon,
  LinkIcon,
  XIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ArrowsOutSimpleIcon,
} from "../PhosphorIcons";
import ProjectImage from "./ProjectImage";

// Expanded view: morphs out of the grid card (shared layoutId), gallery left, write-up right.
// Esc / backdrop closes; ←/→ cycle gallery images.
export default function ProjectDetail({ project, onClose, onZoom, zoomed }) {
  const id = project.id;
  const photos = project.photo ?? [];
  const [index, setIndex] = useState(0);
  const closeRef = useRef(null);
  const step = (d) => setIndex((i) => (i + d + photos.length) % photos.length);

  useEffect(() => closeRef.current?.focus(), []);

  useEffect(() => {
    const onKey = (e) => {
      if (zoomed) return; // fullscreen viewer owns the keys while open
      if (e.key === "Escape") onClose();
      if (photos.length > 1 && e.key === "ArrowRight") setIndex((i) => (i + 1) % photos.length);
      if (photos.length > 1 && e.key === "ArrowLeft") setIndex((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, photos.length, zoomed]);

  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  return (
    <>
      <motion.div {...fade} className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[91] grid place-items-center p-3 md:p-6 pointer-events-none">
        <motion.div
          layoutId={`card-${id}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-title-${id}`}
          className="pointer-events-auto relative w-full max-w-[1440px] max-h-[90vh] overflow-hidden rounded-2xl border border-purple-400/30 bg-zinc-950 shadow-[0_0_60px_rgba(168,85,247,0.15)] grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[2fr_1fr]"
        >
          {/* Gallery */}
          <div className="flex flex-col justify-center gap-3 p-3 md:p-4 bg-black/40 min-h-0">
            <motion.div
              layoutId={`img-${id}`}
              className="group relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 cursor-zoom-in"
              onClick={() => photos.length && onZoom(index)}
            >
              {photos[index] && (
                <ProjectImage src={photos[index].url} alt={`${project.title} ${index + 1}`} className="object-contain" />
              )}
              {photos.length > 0 && (
                <span className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowsOutSimpleIcon size={14} className="text-white" />
                </span>
              )}
              {photos.length > 1 &&
                [
                  [-1, CaretLeftIcon, "left-2", "Previous image"],
                  [1, CaretRightIcon, "right-2", "Next image"],
                ].map(([d, Icon, side, label]) => (
                  <button
                    key={d}
                    type="button"
                    aria-label={label}
                    onClick={(e) => {
                      e.stopPropagation();
                      step(d);
                    }}
                    className={`absolute ${side} top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-purple-500/60 transition-colors`}
                  >
                    <Icon size={16} />
                  </button>
                ))}
            </motion.div>
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {photos.map((p, i) => (
                  <button
                    key={p.id || i}
                    type="button"
                    aria-label={`Show image ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`relative h-14 aspect-video shrink-0 overflow-hidden rounded-md border transition-colors ${
                      i === index ? "border-purple-400" : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ProjectImage src={p.url} alt="" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Write-up */}
          <motion.div
            {...fade}
            transition={{ delay: 0.15 }}
            className="flex flex-col min-h-0 overflow-y-auto custom-scrollbar p-6 md:p-8 gap-5"
          >
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-purple-300 bg-purple-500/10 rounded border border-purple-400/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div>
              <h2 id={`project-title-${id}`} className="text-2xl font-bold text-white leading-tight pr-8">
                {project.title}
              </h2>
              {project.summary && <p className="mt-2 text-sm text-purple-200/80">{project.summary}</p>}
            </div>

            {project.stack?.length > 0 && (
              <div>
                <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">Built with</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span key={tech} className="px-2 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 text-sm leading-relaxed text-gray-300">
              {project.description
                ?.split("\n")
                .filter((p) => p.trim())
                .map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <div className="mt-auto flex gap-3 pt-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-gray-200 transition-colors"
                >
                  <GithubLogoIcon size={14} /> Github
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-purple-500/40 bg-purple-600/20 hover:bg-purple-600/30 text-xs font-mono text-purple-200 transition-colors"
                >
                  <LinkIcon size={14} /> View Demo
                </a>
              )}
            </div>
          </motion.div>

          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <XIcon size={16} />
          </button>
        </motion.div>
      </div>
    </>
  );
}
