/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from "lucide-react";
import { TESTIMONIALS } from "../data";
import { Testimonial } from "../types";

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);

  const activeTestimonials = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % activeTestimonials.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  const activeIndex = current >= activeTestimonials.length ? 0 : current;
  const active = activeTestimonials[activeIndex];

  return (
    <section id="testimonials" className="py-24 bg-white border-t-4 border-neutral-950 relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute top-[20%] left-[5%] w-72 h-72 bg-red-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        {/* Custom Header with Tactile Badge */}
        <div className="flex flex-col items-center mb-16">
          <div className="px-3 py-1 bg-red-400 border-2 border-neutral-950 font-mono text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-4">
            Testimonials
          </div>
          
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-[#121212] tracking-tight leading-none text-center">
            <span className="relative inline-block">
              What My Clients Say
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
        </div>

        {/* Tactile Comic Offset Card Slider */}
        <div className="relative mt-8">
          {/* Animated color backdrop below card */}
          <div className="absolute inset-0 bg-teal-300 border-3 border-neutral-950 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl transform translate-x-3.5 translate-y-3.5" />
          
          <div className="relative bg-white border-3 border-neutral-950 rounded-3xl p-8 md:p-12 z-10 text-center flex flex-col items-center justify-between min-h-[300px]">
            
            {/* Top Quote Badge floating */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-yellow-300 border-3 border-neutral-950 text-neutral-950 flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <Quote className="w-5.5 h-5.5 fill-neutral-950" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center pt-4"
              >
                {/* 5-Star Reviews */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: active.rating }).map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-yellow-300 text-neutral-950" />
                  ))}
                </div>

                {/* Main feedback text */}
                <p className="font-sans text-base sm:text-lg md:text-xl text-neutral-950 font-bold leading-relaxed max-w-2xl mb-8">
                  “{active.text}”
                </p>

                {/* Client profile */}
                <div className="flex items-center gap-3.5 mt-2">
                  <img
                    src={active.image}
                    alt={active.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <h4 className="font-sans text-xs sm:text-sm font-black text-neutral-950 uppercase tracking-wide">
                      {active.author}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-neutral-500">
                      📍 {active.location} • {active.eventDate}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Tactile Bottom Nav Actions */}
            <div className="flex items-center justify-between w-full mt-10 pt-6 border-t-2 border-dashed border-neutral-200">
              
              {/* Previous */}
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-white border-2 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_rgba(0,0,0,1)] cursor-pointer text-neutral-950 transition-all font-bold"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Slider Dots */}
              <div className="flex gap-2.5">
                {activeTestimonials.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrent(idx)}
                    className={`w-3 h-3 rounded-full border-2 border-neutral-950 transition-all cursor-pointer ${
                      activeIndex === idx ? "bg-yellow-300 w-7 shadow-[1px_1px_0px_rgba(0,0,0,1)]" : "bg-white"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-white border-2 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_rgba(0,0,0,1)] cursor-pointer text-neutral-950 transition-all font-bold"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

            </div>

          </div>
        </div>

        {/* Small award footer line-marks */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-5 sm:gap-8 opacity-70">
          <span className="text-[10px] font-mono font-black tracking-widest text-neutral-400">PARTNERSHIPS:</span>
          <span className="text-xs font-mono font-bold text-neutral-900 bg-yellow-100 px-3 py-1 border border-neutral-950 rounded shadow-[1px_1px_0px_rgba(0,0,0,1)]">Chitroborno Collective Co.</span>
          <span className="text-xs font-mono font-bold text-neutral-900 bg-red-100 px-3 py-1 border border-neutral-950 rounded shadow-[1px_1px_0px_rgba(0,0,0,1)]">Studio Montreal Editors</span>
        </div>

      </div>
    </section>
  );
}
