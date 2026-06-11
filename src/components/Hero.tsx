/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Camera, Sparkles, Award, Play, ArrowUpRight, CheckCircle, Sliders } from "lucide-react";

interface HeroProps {
  onOpenBooking: () => void;
  onOpenVideo: () => void;
  heroImageUrl?: string;
  homeTitle?: string;
}

export default function Hero({ onOpenBooking, onOpenVideo, heroImageUrl, homeTitle }: HeroProps) {
  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  const titleString = homeTitle || "Capturing beauty photo";
  let renderedTitle;
  if (titleString.toLowerCase() === "capturing beauty photo") {
    renderedTitle = (
      <>
        Capturing <br />
        beauty <br />
        photo
      </>
    );
  } else {
    // Dynamically wrap text beautifully
    const words = titleString.split(" ");
    if (words.length >= 3) {
      const last = words.pop();
      const middle = words.pop();
      const first = words.join(" ");
      renderedTitle = (
        <>
          {first} <br />
          {middle} <br />
          {last}
        </>
      );
    } else if (words.length === 2) {
      renderedTitle = (
        <>
          {words[0]} <br />
          {words[1]}
        </>
      );
    } else {
      renderedTitle = titleString;
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-[85vh] lg:min-h-[90vh] pt-28 pb-12 sm:pt-32 sm:pb-16 flex items-center overflow-hidden bg-[#FAF9F6] bg-grain"
    >
      {/* Dynamic background accents resembling abstract cartoon shapes */}
      <div className="absolute top-[15%] left-[5%] w-72 h-72 rounded-full bg-yellow-300/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 rounded-full bg-red-300/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center w-full relative z-10">
        
        {/* Left Column: Creative Typography & Copywriting (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col items-start gap-4 text-left lg:pr-6">
          
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-[42px] sm:text-[54px] lg:text-[64px] font-bold tracking-tight leading-[1.08] text-neutral-950"
            >
              {renderedTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-[13.5px] sm:text-[14.5px] text-neutral-600 leading-relaxed max-w-sm font-medium"
            >
              Let's take your photograph to the next level. Capturing your wonderful and beautiful moment of your life.
            </motion.p>
          </div>

        </div>

        {/* Center Column: Portrait illustration with yellow backing shapes (lg:col-span-4) */}
        <div className="lg:col-span-4 relative flex justify-center items-center mt-6 lg:mt-0">
          
          {/* Yellow Geometric Star / Sparkle Shapes behind the main illustration cutout */}
          <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] w-[85%] sm:w-[90%] h-[85%] sm:h-[90%] pointer-events-none z-0">
            {/* The signature star background block from the reference image */}
            <div className="absolute inset-0 bg-yellow-400 rounded-[2rem] rotate-6 border-3 border-neutral-950 shadow-[6px_6px_0px_rgba(0,0,0,1)]" />
            
            {/* Hand-drawn Star Sparkles */}
            <svg className="absolute -top-4 right-4 w-9 h-9 text-teal-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" viewBox="0 0 24 24">
              <path fill="currentColor" stroke="#000" strokeWidth="1.5" d="M12 2l3 6.5 6.5 3-6.5 3-3 6.5-3-6.5-6.5-3 6.5-3z" />
            </svg>
            <svg className="absolute top-1/3 -right-6 w-7 h-7 text-yellow-300 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]" viewBox="0 0 24 24">
              <path fill="currentColor" stroke="#000" strokeWidth="1.5" d="M12 2l3 6.5 6.5 3-6.5 3-3 6.5-3-6.5-6.5-3 6.5-3z" />
            </svg>
            <svg className="absolute bottom-6 -left-6 w-8 h-8 text-neutral-950" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M10 20 Q 25 10 40 40" strokeLinecap="round" />
            </svg>
          </div>

          {/* Main Portrait frame card: Presenting high-quality cleanly uploaded photos with zero color blending or background multiplying */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] h-[21rem] sm:h-[27rem] lg:h-[31rem] bg-white border-3 border-neutral-950 shadow-[6px_6px_0px_rgba(0,0,0,1)] p-3 rounded-3xl overflow-hidden group"
          >
            <img
              src={heroImageUrl || "/input_file_1.png"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=700";
              }}
              alt="Shadman Alif Photography Showcase"
              className="w-full h-full object-cover rounded-2xl select-none hover:scale-[1.03] transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </motion.div>

        </div>

        {/* Right Column: Stacked items (lg:col-span-3) */}
        <div className="lg:col-span-3 flex flex-col gap-5 lg:pl-6 justify-center mt-8 lg:mt-0">
          
          {/* Item 1: Professional photo editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 bg-red-400 border-2 border-neutral-950 rounded-xl shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
              <Sliders className="w-4.5 h-4.5 text-neutral-950" />
            </div>
            <span className="font-sans text-[13.5px] sm:text-[14px] font-bold text-neutral-800 leading-snug">
              Professional photo editor
            </span>
          </motion.div>

          {/* Item 2: 6 years experience */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 bg-teal-300 border-2 border-neutral-950 rounded-xl shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
               <Award className="w-4.5 h-4.5 text-neutral-950" />
            </div>
            <span className="font-sans text-[13.5px] sm:text-[14px] font-bold text-neutral-800 leading-snug">
              6 years experience
            </span>
          </motion.div>

          {/* Item 3: photographer & Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 bg-yellow-400 border-2 border-neutral-950 rounded-xl shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
              <Camera className="w-4.5 h-4.5 text-neutral-950" />
            </div>
            <span className="font-sans text-[13.5px] sm:text-[14px] font-bold text-neutral-800 leading-snug">
              photographer & Editor
            </span>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
