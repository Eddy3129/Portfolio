"use client";

import { useState } from "react";
import { Github, ExternalLink, Folder, Maximize2, Info } from "lucide-react";
import { motion } from "framer-motion";
import ProjectImage from "./ProjectImage";

export default function ProjectCard({ project, openModal }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const handleFlip = (e) => {
    // Prevent flip if clicking on interactive elements
    if (e.target.closest("button") || e.target.closest("a")) return;
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="project-card-container group">
      {/* Flippable Content */}
      <div className="relative flex-1 w-full" style={{ perspective: "1000px" }}>
        <motion.div
          className="w-full h-full relative"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 flex flex-col"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Image Section - No Flip */}
            <div className="relative h-56 w-full overflow-hidden shrink-0">
              {project.photo && project.photo.length > 0 ? (
                <>
                  <ProjectImage
                    src={project.photo[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                  <Folder className="text-zinc-600" size={40} />
                </div>
              )}

              {/* Tags */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                {project.tags?.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white bg-purple-900/70 rounded border border-purple-400/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Section - Click to Flip */}
            <div
              className="p-6 flex-1 flex flex-col relative cursor-pointer hover:bg-white/5 transition-colors"
              onClick={handleFlip}
            >
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                {project.title}
              </h3>

              {/* Summary */}
              {project.summary && (
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-4">
                  {project.summary}
                </p>
              )}

              {/* Visual cue for flipping */}
              <div className="mt-auto flex items-center gap-2 text-xs text-purple-400/60 font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Info size={12} /> Click to view details
              </div>
            </div>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 flex flex-col bg-zinc-900/95 backdrop-blur-xl p-6"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Tabs */}
            <div
              className="flex gap-4 border-b border-white/10 pb-2 mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveTab("about")}
                className={`text-sm font-bold uppercase tracking-wider pb-2 -mb-2.5 transition-colors ${
                  activeTab === "about"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`text-sm font-bold uppercase tracking-wider pb-2 -mb-2.5 transition-colors ${
                  activeTab === "gallery"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Gallery
              </button>
            </div>

            {/* Tab Content */}
            <div
              className="flex-1 overflow-y-auto custom-scrollbar pr-6"
              onClick={(e) => e.stopPropagation()}
            >
              {activeTab === "about" ? (
                <div
                  className="space-y-4 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                  onClick={handleFlip}
                >
                  {/* All Tags */}
                  {project.stack && (
                    <div className="pb-4 border-b border-white/5 mb-4">
                      <p className="text-xs text-gray-500 mb-2 font-mono uppercase">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] px-2 py-1 bg-purple-400/10 rounded-xl text-purple-400 border border-purple-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-300 leading-relaxed text-justify font-sans space-y-4">
                    {project.description
                      ?.split("\n")
                      .map(
                        (paragraph, idx) =>
                          paragraph.trim() && <p key={idx}>{paragraph}</p>
                      )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {project.photo?.map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 cursor-zoom-in hover:border-purple-400/50 transition-colors relative group/img"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(project, idx);
                      }}
                    >
                      <ProjectImage
                        src={photo.url}
                        alt={`${project.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                        <Maximize2
                          className="text-white opacity-0 group-hover/img:opacity-100 transform scale-75 group-hover/img:scale-100 transition-all"
                          size={16}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Static Buttons Footer */}
      <div
        className="p-4 border-t border-white/5 bg-zinc-900/50 backdrop-blur-sm z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 hover:border-white/20 rounded-lg text-xs font-mono transition-all text-gray-300 hover:text-white group/btn"
            >
              <Github
                size={14}
                className="group-hover/btn:scale-110 transition-transform"
              />
              <span>Github</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 rounded-lg text-xs font-mono transition-all text-purple-400 hover:text-purple-300 group/btn"
            >
              <ExternalLink
                size={14}
                className="group-hover/btn:scale-110 transition-transform"
              />
              <span>View Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
