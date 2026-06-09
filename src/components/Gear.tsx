/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Camera, Aperture, Sun, Box, Sparkles, CheckCircle, Laptop } from "lucide-react";
import { GearItem } from "../types";

export default function Gear({ items = [] }: { items?: GearItem[] }) {
  const [activeCategory, setActiveCategory] = useState<"all" | "bodies" | "lenses" | "lighting" | "modifiers" | "workstations">("all");

  const filteredItems = activeCategory === "all"
    ? items
    : items.filter((item) => item.category === activeCategory);

  const categories = [
    { id: "all", label: "All Gear" },
    { id: "bodies", label: "Camera Bodies" },
    { id: "lenses", label: "Prime Lenses" },
    { id: "lighting", label: "Continuous & Flash" },
    { id: "modifiers", label: "Softboxes & Grids" },
    { id: "workstations", label: "Editing Workstations" },
  ];

  return (
    <section id="gear" className="py-24 bg-[#FAF9F6] border-t-4 border-neutral-950 relative overflow-hidden bg-grain">
      {/* Decorative sparkles */}
      <div className="absolute top-[8%] right-[5%] w-10 h-10 opacity-30 pointer-events-none hidden sm:block">
        <Sparkles className="w-full h-full text-yellow-500" />
      </div>
      <div className="absolute bottom-[8%] left-[5%] w-12 h-12 opacity-30 pointer-events-none hidden sm:block">
        <Sparkles className="w-full h-full text-indigo-400" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-3 py-1 bg-yellow-400 border-2 border-neutral-950 font-mono text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-4"
          >
            Behind The Frames
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-none"
          >
            <span className="relative inline-block">
              My Premium Gear
              <svg
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-80 h-[10px] text-teal-300"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M1,5 C40,9 60,1 99,5"
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
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-sm text-neutral-600 font-semibold leading-relaxed mt-8 max-w-xl"
          >
            To capture razor-sharp moments with unmatched dynamic range and atmospheric depth, I use a carefully curated suite of ultra-fast prime lenses and studio modifiers.
          </motion.p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 font-sans text-xs sm:text-sm font-bold border-2 border-neutral-950 rounded-lg transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-neutral-950 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                  : "bg-white text-neutral-800 hover:bg-neutral-100 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Gear Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => {
            // Pick corresponding icon
            let GearIcon = Camera;
            if (item.category === "lenses") GearIcon = Aperture;
            if (item.category === "lighting") GearIcon = Sun;
            if (item.category === "modifiers") GearIcon = Box;
            if (item.category === "workstations") GearIcon = Laptop;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="neo-card p-6 flex flex-col justify-between bg-white relative overflow-hidden group"
              >
                <div>
                  {/* Category Pill and Visual Floating Icon */}
                  <div className="flex justify-between items-center mb-5">
                    <span className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase font-black">
                      // {item.categoryLabel}
                    </span>
                    <div className={`px-2.5 py-1 text-[11px] font-extrabold border-2 border-neutral-950 uppercase tracking-wider rounded-md shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] ${item.tagColor}`}>
                      {item.tag}
                    </div>
                  </div>

                  <div className="flex gap-4 items-start mb-4">
                    <div className="p-3 bg-[#FAF9F6] border-2 border-neutral-950 rounded-xl shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 group-hover:bg-yellow-100 transition-colors">
                      <GearIcon className="w-5 h-5 text-neutral-950" />
                    </div>
                    <div>
                      <h4 className="font-sans text-xl font-bold tracking-tight text-neutral-950 leading-snug">
                        {item.name}
                      </h4>
                      <p className="font-mono text-[11px] font-semibold text-neutral-500 mt-0.5">
                        {item.specs}
                      </p>
                    </div>
                  </div>

                  <p className="font-sans text-[13.5px] leading-relaxed text-neutral-600 font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-neutral-200 flex items-center gap-2 text-[12px] font-semibold text-neutral-500">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Calibrated & Studio Verified</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
