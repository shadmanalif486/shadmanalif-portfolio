/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Projector, Info, Calendar, MapPin } from "lucide-react";
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
  const [showInfo, setShowInfo] = useState(true);



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
        className="fixed inset-0 z-50 bg-neutral-950/98 backdrop-blur-md flex flex-col lg:flex-row"
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
                {project.coupleNames}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Info toggler button */}
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded-full border text-white hover:bg-white/15 transition-all cursor-pointer ${
                  showInfo ? "bg-luxury-orange border-luxury-orange" : "bg-transparent border-white/20"
                }`}
                title="Toggle metadata menu"
              >
                <Info className="w-5 h-5" />
              </button>

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
            <div className="w-full max-w-4xl aspect-video bg-black/50 border border-white/10 rounded-sm overflow-hidden shadow-2xl relative">
              <iframe
                title={`Wedding Cinema Teaser for ${project.coupleNames}`}
                src={project.videoUrl}
                className="w-full h-full border-none pointer-events-auto"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            /* Slider Images */
            <div className="relative w-full max-w-5xl h-[65vh] sm:h-[78vh] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={project.galleryImages[activeIndex]}
                  alt={`${project.coupleNames} gallery photo ${activeIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-full max-h-full object-contain rounded-md pointer-events-none shadow-2xl"
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

        {/* Right Info Sidebar (Aesthetic Metadata Board) */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.4 }}
              className="w-full lg:w-96 bg-neutral-900 border-t lg:border-t-0 lg:border-l border-white/10 p-8 flex flex-col justify-between overflow-y-auto max-h-[400px] lg:max-h-none text-left"
            >
              
              {/* Project description panel */}
              <div className="space-y-8 mt-16 md:mt-20">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-luxury-gold">
                    HISTORIC REVELATION
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-white mt-1 leading-tight">
                    {project.title}
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 font-light mt-4 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Logistics */}
                <div className="space-y-3.5 border-t border-b border-white/10 py-6">
                  <div className="flex items-center gap-3 text-neutral-300">
                    <MapPin className="w-4 h-4 text-luxury-orange flex-shrink-0" />
                    <span className="text-xs font-sans font-light">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-300">
                    <Calendar className="w-4 h-4 text-luxury-orange flex-shrink-0" />
                    <span className="text-xs font-sans font-light">Commission Year: {project.year}</span>
                  </div>
                </div>



              </div>

              {/* Action query button */}
              <div className="mt-12 pt-6 border-t border-white/10">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-4 bg-luxury-orange hover:bg-amber-500 text-white font-sans text-xs tracking-widest font-semibold uppercase flex items-center justify-center gap-2 transition-all rounded-none"
                >
                  RESERVE SAME STYLE
                </a>
                <span className="block text-center text-[9px] text-neutral-500 font-mono mt-3 uppercase tracking-wider">
                  Subject to physical scout availability
                </span>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </AnimatePresence>
  );
}
