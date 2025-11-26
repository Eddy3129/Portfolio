"use client";

import { useState, useCallback } from "react";
import ImageModal from "../experience/ImageModal";
import ProjectCard from "./ProjectCard";

export default function Projects({ initialProjects = [] }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = useCallback((project, index = 0) => {
    if (project.photo && project.photo.length > 0) {
      setSelectedProject(project);
      setCurrentImageIndex(index);
      setIsModalOpen(true);
    }
  }, []);

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

      {/* Scrollable Grid */}
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialProjects.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                openModal={openModal}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={selectedProject?.photo}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />
    </div>
  );
}
