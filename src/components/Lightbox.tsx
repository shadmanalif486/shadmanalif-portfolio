/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Projector } from "lucide-react";
import { Project } from "../types";

interface LightboxProps {
  project: Project | null;
  startWithVideo?: boolean;
  onClose: () => void;
}

export default function Lightbox({ project, startWithVideo = false, onClose }: LightboxProps) {
  if (!project) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(startWithVideo);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % project.galleryImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + project.galleryImages.length) % project.galleryImages.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-neutral-950/98 backdrop-blur-md flex flex-col"
      >
        
        {/* Main Content Viewer: Images or Video screen */}
        <div className="flex-1 min-h-0 relative flex items-center justify-center p-4">
          
          {/* Top floating control panel */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <div className="text-left text-white/90">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-luxury-gold block">
                CHITROBORNO COUTURE GALLERY
              </span>
              <h2 className="font-serif text-lg sm:text-2xl font-bold leading-tight uppercase tracking-wider">
                {project.coupleNames || project.title}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 text-white border border-white/25 hover:bg-luxury-orange hover:text-white transition-all cursor-pointer"
                title="Close Darkroom"
                id="close-lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Screen Selector Component */}
          {showVideo && project.videoUrl ? (
            /* Responsive Youtube Cinema Modal Iframe */
            <div className="w-full max-w-5xl aspect-video bg-black/50 border border-white/10 rounded-sm overflow-hidden shadow-2xl relative">
              <iframe
                title={`Wedding Cinema Teaser for ${project.coupleNames}`}
                src={project.videoUrl}
                className="w-full h-full border-none pointer-events-auto"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            /* Slider Images - Frame kata chara (uncropped, full-fit, sharp edges) */
            <div className="relative w-full max-w-7xl h-[80vh] sm:h-[85vh] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={project.galleryImages[activeIndex]}
                  alt={`${project.coupleNames} gallery photo ${activeIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-full object-contain pointer-events-none shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Slider Arrows */}
              {project.galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-luxury-orange text-white cursor-pointer hover:scale-105 transition-all border-none z-10"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-luxury-orange text-white cursor-pointer hover:scale-105 transition-all border-none z-10"
                    title="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white font-mono text-[10px] px-3 py-1 rounded-full tracking-widest z-10">
                    {activeIndex + 1} / {project.galleryImages.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Video Toggle tab button in footer */}
          {project.videoUrl && (
            <div className="absolute bottom-6 flex gap-2">
              <button
                onClick={() => setShowVideo(false)}
                className={`px-5 py-2.5 font-sans text-[10px] tracking-widest uppercase font-semibold cursor-pointer transition-all ${
                  !showVideo ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                LOOKBOOK GALLERY
              </button>
              <button
                onClick={() => setShowVideo(true)}
                className={`px-5 py-2.5 font-sans text-[10px] tracking-widest uppercase font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  showVideo ? "bg-luxury-orange text-white" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Projector className="w-3.5 h-3.5" />
                PLAY CINEMATIC TEASER
              </button>
            </div>
          )}

        </div>

      </motion.div>
    </AnimatePresence>
  );
}
