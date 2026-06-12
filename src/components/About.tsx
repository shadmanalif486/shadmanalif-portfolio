/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Sparkles, Sliders, CheckCircle, Award, Compass, Heart } from "lucide-react";

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-mono text-3.5xl sm:text-5xl font-extrabold text-[#121212]">
      {count}
      {suffix}
    </span>
  );
};

export default function About({
  meImageUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=95&w=1600",
  collabImageUrl = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=95&w=1200",
  meImageFit = "cover"
}: {
  meImageUrl?: string;
  collabImageUrl?: string;
  meImageFit?: string;
}) {
  return (
    <section id="about" className="py-24 bg-[#FAF9F6] border-t-4 border-neutral-950 overflow-hidden relative">
      <div className="absolute top-[10%] right-[5%] w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Comic Offset Images Layout */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-start">
            
            {/* Playful offset yellow cardboard background mimicking the reference image style */}
            <div className="absolute bottom-[-15px] right-[10px] w-76 sm:w-84 h-[26rem] bg-yellow-300 border-3 border-neutral-950 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-2xl rotate-[-3deg] pointer-events-none" />
            
            {/* Main Portrait frame */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative w-72 sm:w-80 h-[25rem] bg-white border-3 border-neutral-950 shadow-[4px_4px_0px_rgba(0,0,0,1)] p-3 rounded-2xl"
            >
              <img
                src={meImageUrl}
                alt="Shadman Alif working"
                className={`w-full h-full rounded-xl pointer-events-none transition-all duration-500 ${
                  meImageFit === "contain"
                    ? "object-contain bg-neutral-900 border border-neutral-800 p-1"
                    : "object-cover object-center"
                }`}
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Overlapping Small Action Polaroid - Removed as requested */}
            </motion.div>

          </div>

          {/* Right Column: Narrative Copy & Stats */}
          <div className="lg:col-span-7 text-left flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-400 border-2 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase text-[10px] font-mono font-bold text-neutral-950 w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Meet Shadman Alif</span>
            </div>

            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight mb-6">
              Preserving <span className="brush-highlight">Emotions</span>, Atmosphere, and Authentic Memories
            </h2>

            <div className="space-y-4 text-neutral-800 text-sm sm:text-base leading-relaxed font-sans max-w-2xl font-medium">
              <p>
                Hi, I’m <strong>Shadman Alif</strong> — a professional wedding photographer and retoucher based in <strong>Mymensingh, Bangladesh</strong>. 
                Since 2020, I’ve been working in the wedding photography industry, capturing emotional, timeless, and story-driven moments that couples can relive forever.
              </p>
              <p>
                My journey started with the renowned <strong className="text-neutral-950 font-bold border-b-2 border-dashed border-yellow-400 pb-0.5">“Chitroborno Team”</strong>, 
                where I gained real-world experience in wedding storytelling, creative composition, lighting, and cinematic visual aesthetics.
              </p>
              <p>
                As a freelance wedding photographer and remote photo editor, I partner with local couples and international photography studios to deliver premium-quality images with professional editing and advanced high-end retouching. I believe wedding photography is not just about taking pictures — it’s about conveying details people can feel, not just see.
              </p>
            </div>

            {/* Core Philosophy Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t-2 border-dashed border-neutral-300">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-neutral-950 flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5 text-neutral-950" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase text-neutral-900">Atmosphere Driven</h4>
                  <p className="text-[11px] text-neutral-600 mt-0.5 font-medium">Focusing on lighting nuances and raw environmental heat.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-teal-300 border-2 border-neutral-950 flex items-center justify-center shrink-0">
                  <Sliders className="w-3.5 h-3.5 text-neutral-950" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase text-neutral-900">Surgical Retouching</h4>
                  <p className="text-[11px] text-neutral-600 mt-0.5 font-medium">Frequency separation that maintains skin texture perfectly.</p>
                </div>
              </div>
            </div>

            {/* Dynamic Numeric Counters */}
            <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t-2 border-solid border-neutral-950">
              <div>
                <AnimatedCounter end={150} suffix="+" />
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mt-1">
                  Events Preserved
                </span>
              </div>
              <div>
                <AnimatedCounter end={6} suffix="+" />
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mt-1">
                  Years of Craft
                </span>
              </div>
              <div>
                <AnimatedCounter end={100} suffix="%" />
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mt-1">
                  Authentic Joy
                </span>
              </div>
            </div>

         </div>

        </div>
      </div>
    </section>
  );
}
