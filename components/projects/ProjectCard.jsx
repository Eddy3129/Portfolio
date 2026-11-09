"use client";

import { motion } from "framer-motion";
import { LinkIcon } from "../PhosphorIcons";
import ProjectImage from "./ProjectImage";

// Compact grid card. Whole card opens the detail view; it morphs out of this card via layoutId.
export default function ProjectCard({ project, onOpen }) {
  const id = project.id;
  const cover = project.photo?.[0]?.url;

  return (
    <motion.button
      type="button"
      layoutId={`card-${id}`}
      onClick={onOpen}
      className="group flex flex-col text-left rounded-xl overflow-hidden border border-white/10 bg-zinc-900/60 backdrop-blur-sm hover:border-purple-400/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] transition-[border-color,translate,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-purple-400"
    >
      {/* framed + object-contain: covers have mixed ratios, cropping cut off their text */}
      <motion.div layoutId={`img-${id}`} className="relative aspect-video w-full bg-black/60 p-2">
        {cover ? (
          <div className="relative h-full w-full overflow-hidden rounded-md border border-white/10">
            <ProjectImage
              src={cover}
              alt={project.title}
              className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <LinkIcon className="text-zinc-600" size={32} />
          </div>
        )}
      </motion.div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
          {project.title}
        </h3>
        {project.summary && <p className="text-xs leading-relaxed text-gray-400 line-clamp-2">{project.summary}</p>}
        {project.tags?.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-purple-300 bg-purple-500/10 rounded border border-purple-400/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}
