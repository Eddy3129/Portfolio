"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import ImageModal from "../experience/ImageModal";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";

export default function Projects({ initialProjects = [] }) {
  const [openId, setOpenId] = useState(null);
  const [zoomIndex, setZoomIndex] = useState(null);
  const open = initialProjects.find((p) => p.id === openId);
  const close = useCallback(() => setOpenId(null), []);

  return (
    <div className="fixed inset-0 w-full text-white font-sans flex flex-col overflow-hidden">
      {/* Fixed Background */}
      <div className="absolute inset-0 bg-linear-to-b from-black/50 to-purple-900/20 -z-10" />

      {/* Fixed Header */}
      <div className="w-full shrink-0 pt-30 mb-5 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end gap-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-mono text-white">
              Projects<span className="text-purple-400">_</span>
            </h1>
            <div className="h-px flex-1 bg-linear-to-r from-purple-400/50 to-transparent mb-4"></div>
          </div>
        </div>
      </div>

      <LayoutGroup>
        {/* Scrollable Grid */}
        <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-6 pb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {initialProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => setOpenId(project.id)}
              />
            ))}
          </div>
        </div>

        {/* portal: the page wrapper is its own stacking context, so the dialog couldn't clear the navbar */}
        {typeof document !== "undefined" &&
          createPortal(
            <>
              <AnimatePresence>
                {open && (
                  <ProjectDetail
                    key={open.id}
                    project={open}
                    onClose={close}
                    onZoom={setZoomIndex}
                    zoomed={zoomIndex !== null}
                  />
                )}
              </AnimatePresence>
              <ImageModal
                isOpen={zoomIndex !== null}
                onClose={() => setZoomIndex(null)}
                images={open?.photo}
                currentIndex={zoomIndex ?? 0}
                setCurrentIndex={setZoomIndex}
              />
            </>,
            document.body,
          )}
      </LayoutGroup>
    </div>
  );
}
