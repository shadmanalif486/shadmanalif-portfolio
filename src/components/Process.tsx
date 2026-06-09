/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { motion } from "motion/react";
import { MessageSquare, Camera, Sliders, Sparkles, Gift, CheckCircle2 } from "lucide-react";
import { PROCESS_STEPS } from "../data";

export default function Process() {
  const getStepIcon = (num: number, className: string) => {
    switch (num) {
      case 1: return <MessageSquare className={className} />;
      case 2: return <Camera className={className} />;
      case 3: return <Sliders className={className} />;
      case 4: return <Sparkles className={className} />;
      case 5: return <CheckCircle2 className={className} />;
      default: return <Camera className={className} />;
    }
  };

  const colors = ["bg-red-100", "bg-yellow-100", "bg-teal-100", "bg-orange-100", "bg-blue-100"];

  return (
    <section id="process" className="py-24 bg-[#FAF9F6] border-t-4 border-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <div className="px-3 py-1 bg-red-400 border-2 border-neutral-950 font-mono text-xs font-bold uppercase tracking-widest text-[#121212] shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-4">
            My Process
          </div>
          
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-[#121212] tracking-tight leading-none text-center">
            <span className="relative inline-block">
              My Creative Workflow
              <svg
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-64 h-[10px] text-yellow-300"
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
          </h2>
          <p className="font-sans text-sm text-neutral-600 font-semibold leading-relaxed mt-8 max-w-xl mx-auto">
            A refined wedding storytelling process designed to capture emotions, preserve memories, and deliver timeless cinematic visuals with precision and artistry.
          </p>
        </div>

        {/* Tactile Timeline Card Flow */}
        <div className="relative max-w-4xl mx-auto">
          {/* Thick connecting outline path */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[4px] bg-neutral-950 -translate-x-1/2 hidden md:block" />

          <div className="space-y-16">
            {PROCESS_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              const cardBg = colors[index % colors.length];

              return (
                <motion.div
                  key={step.stepNumber}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className={`flex flex-col md:flex-row items-stretch gap-8 relative ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Central Node Pointer */}
                  <div className="absolute left-6 md:left-1/2 top-8 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-3 border-neutral-950 flex items-center justify-center z-20 shadow-[2px_2px_0px_rgba(0,0,0,1)] hidden md:flex">
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-300 border border-neutral-950" />
                  </div>

                  {/* Copy Panel Card */}
                  <div className="w-full md:w-[46%] text-left">
                    <div className="relative">
                      {/* Red/Yellow/Mint Card Offset Box */}
                      <div className="absolute inset-0 bg-neutral-950 border-3 border-neutral-950 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-2xl transform translate-x-2.5 translate-y-2.5" />
                      
                      {/* Main Card Frame */}
                      <div className={`relative bg-white border-3 border-neutral-950 p-6 sm:p-8 rounded-2xl overflow-hidden hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform z-10`}>
                        {/* Big Stamp Index Serial */}
                        <span className="absolute right-4 top-2 font-mono text-5xl sm:text-6xl font-black text-neutral-100 select-none">
                          0{step.stepNumber}
                        </span>

                        {/* Custom icon rounded bubble */}
                        <div className={`w-12 h-12 rounded-xl ${cardBg} border-2 border-neutral-950 flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-5`}>
                          {getStepIcon(step.stepNumber, "w-6 h-6 text-neutral-950")}
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                            {step.description}
                          </span>
                          <span className="text-[10px] font-mono font-black text-teal-500 tracking-wide">
                            {step.duration}
                          </span>
                        </div>

                        <h3 className="font-sans text-lg sm:text-xl font-extrabold text-[#121212] mb-3">
                          {step.title}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-neutral-600 font-semibold leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for grid alignment */}
                  <div className="hidden md:block w-[46%]" />

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
