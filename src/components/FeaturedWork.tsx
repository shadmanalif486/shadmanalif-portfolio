/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROJECTS } from "../data";
import { Project } from "../types";
import { Camera, Sparkles, Sliders, Eye, Play, ArrowRight, ArrowDown } from "lucide-react";

interface FeaturedWorkProps {
  onSelectProject: (project: Project, forceVideo?: boolean) => void;
  projects?: Project[];
}

export default function FeaturedWork({ onSelectProject, projects }: FeaturedWorkProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const activeProjects = projects && projects.length > 0 ? projects : PROJECTS;

  const categories = [
    { value: "all", label: "All Works" },
    { value: "photography", label: "Wedding Stories" },
    { value: "couple-shoot", label: "Couple Sessions" },
    { value: "traditional", label: "Retouch Masterclass" }
  ];

  const filteredProjects = activeTab === "all"
    ? activeProjects
    : activeProjects.filter((proj) => proj.category === activeTab);

  // Rotating angle alternates based on index for the authentic "scattered desk photos" look requested!
  const getRotationAngle = (index: number) => {
    const angles = ["sm:-rotate-2", "sm:rotate-2", "sm:-rotate-1", "sm:rotate-1"];
    return angles[index % angles.length];
  };

  // Backdrops color accents alternates
  const getBackdropColor = (index: number) => {
    const colors = ["bg-red-400", "bg-yellow-300", "bg-teal-300", "bg-amber-400"];
    return colors[index % colors.length];
  };

  return (
    <section id="portfolio" className="py-24 bg-[#FAF9F6] border-t-4 border-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header matching mockup (My All Latest Featured Work) */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-3 py-1 bg-yellow-300 border-2 border-neutral-950 font-mono text-xs font-bold uppercase tracking-widest text-[#121212] shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-4"
          >
            Curated Lookbook
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-extrabold text-[#121212] tracking-tight leading-none text-center"
          >
            <span className="relative inline-block">
              My All Latest Featured Work
              <svg
                className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-96 h-[10px] text-yellow-300"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M1,5 C40,1 60,9 99,5"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-sm text-neutral-600 font-semibold leading-relaxed mt-8 max-w-xl"
          >
            Chasing genuine gestures on Brahmaputra riverbanks and remote editorial studios. Each image reflects dedicated post-processing and hand-painted lighting.
          </motion.p>
        </div>

        {/* Categories Tab selector using tactile card cells */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveTab(cat.value)}
              className={`px-5 py-2.5 font-sans text-xs tracking-wider uppercase font-bold border-2 border-neutral-950 transition-all cursor-pointer ${
                activeTab === cat.value
                  ? "bg-yellow-300 text-neutral-950 shadow-[3px_3px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                  : "bg-white text-neutral-600 hover:text-neutral-950 hover:bg-yellow-101 hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scattered Polaroid Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-14">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className={`relative group shrink-0 ${getRotationAngle(index)} transition-transform duration-300 hover:rotate-0`}
              >
                {/* Visual solid offset backdrop board imitating physical cutout card */}
                <div className={`absolute inset-0 border-3 border-neutral-950 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl ${getBackdropColor(index)} transform translate-x-3.5 translate-y-3.5 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />

                {/* Primary Card structure */}
                <div className="relative bg-white border-3 border-neutral-950 rounded-3xl p-4 flex flex-col z-10 w-full overflow-hidden">
                  
                  {/* Polaroid Main Image framing */}
                  <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden border-2 border-neutral-950 bg-neutral-100 relative group">
                    <img
                      src={project.mainImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 pointer-events-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Left corner mini tag */}
                    <div className="absolute top-4 left-4 bg-white border-2 border-neutral-950 px-2.5 py-1 text-[9px] font-mono font-extrabold uppercase rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-1 text-neutral-950">
                      {project.category === "traditional" ? (
                        <Sliders className="w-3 h-3 text-red-400" />
                      ) : (
                        <Camera className="w-3 h-3 text-yellow-300" />
                      )}
                      <span>{project.category === "traditional" ? "RETOUCH" : "PHOTO"}</span>
                    </div>

                    {/* Year badge */}
                    <div className="absolute top-4 right-4 bg-neutral-950 text-white border-2 border-neutral-950 px-2.5 py-1 text-[9px] font-mono font-extrabold rounded-full">
                      {project.year}
                    </div>
                  </div>

                  {/* Context Info Footer */}
                  <div className="pt-6 pb-2 text-left px-1">
                    <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                      📍 {project.location}
                    </span>
                    <h3 className="font-sans text-2xl font-black text-neutral-950 mt-1 leading-tight mb-2">
                      {project.coupleNames || project.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-neutral-700 font-semibold leading-relaxed mb-4">
                      {project.tagline}
                    </p>

                    {/* Tactile Bottom Interaction Controls */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="flex items-center gap-1.5 px-4.5 py-2.5 bg-yellow-300 text-neutral-950 text-xs font-extrabold border-2 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-sans"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Explore Gallery</span>
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Custom prompt footer block */}
        <div className="text-center mt-20 pt-4 border-t-2 border-dashed border-neutral-300">
          <p className="font-sans text-sm font-bold text-neutral-600">
            Want editorial photo editing or custom wedding coverage?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 mt-3 font-mono text-xs font-bold uppercase text-neutral-950 group hover:text-yellow-500 transition-colors"
          >
            <span>Let's talk on Mymensingh shoot dates</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}
