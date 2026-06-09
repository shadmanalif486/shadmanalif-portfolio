/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { SERVICES } from "../data";
import { Service } from "../types";

// Safe specific icon mappings for Lucide
const IconRenderer = ({ name, className }: { name: string; className: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.Camera className={className} />;
  return <IconComponent className={className} />;
};

interface ServicesProps {
  onSelectService: (service: Service) => void;
  services?: Service[];
}

export default function Services({ onSelectService, services }: ServicesProps) {
  const activeServices = services && services.length > 0 ? services : SERVICES;

  return (
    <section
      id="services"
      className="py-24 bg-white border-t-4 border-neutral-950 relative overflow-hidden"
    >
      {/* Decorative cartoon stars */}
      <div className="absolute top-[10%] left-[2%] w-16 h-16 opacity-30 pointer-events-none hidden sm:block">
        <LucideIcons.Sparkles className="w-full h-full text-yellow-300" />
      </div>
      <div className="absolute bottom-[10%] right-[2%] w-12 h-12 opacity-30 pointer-events-none hidden sm:block">
        <LucideIcons.Sparkles className="w-full h-full text-red-300" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Customized Section Header matching mockup (Services I Provide with brush underline!) */}
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-3 py-1 bg-teal-300 border-2 border-neutral-950 font-mono text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-4"
          >
            My Expertise
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-none"
          >
            <span className="relative inline-block">
              Service I Provide
              <svg
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-80 h-[10px] text-yellow-300"
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
            Providing high-end editorial coverage, color correction, and digital darkroom services. We elevate local frames to cinematic standard.
          </motion.p>
        </div>

        {/* Services Neo-Grid with thick black outlines and shadows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="neo-card flex flex-col p-8 group relative overflow-hidden bg-white hover:-rotate-1"
            >
              {/* Colored tag on top right corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-300 border-b-3 border-l-3 border-neutral-950 rotate-45 translate-x-8 -translate-y-8 pointer-events-none group-hover:bg-[#FAF9F6] transition-colors" />

              {/* Icon & Category block */}
              <div className="flex items-center gap-4.5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-yellow-100 border-3 border-neutral-950 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center text-neutral-955 shrink-0 group-hover:bg-yellow-300 transition-colors">
                  <IconRenderer name={service.iconName} className="w-6.5 h-6.5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    {service.subtitle}
                  </span>
                  <h3 className="font-sans text-xl font-bold text-neutral-950">
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-sm text-neutral-700 leading-relaxed font-medium mb-6 flex-grow">
                {service.description}
              </p>

              {/* Deliverables details */}
              <div className="border-t-2 border-dashed border-neutral-200 pt-5 mb-6">
                <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-3">
                  Signature Inclusions
                </p>
                <ul className="space-y-2">
                  {service.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 font-semibold font-sans">
                      <LucideIcons.CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & Booking CTA */}
              <div className="flex items-end justify-between mt-auto pt-4 border-t-3 border-solid border-neutral-950">
                <div>
                  <span className="block text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400 leading-none">Price Standard</span>
                  <span className="font-mono text-sm sm:text-base font-extrabold text-neutral-950 mt-1 block">
                    {service.startingPrice}
                  </span>
                </div>
                
                <button
                  onClick={() => onSelectService(service)}
                  className="px-4 py-2 font-sans text-xs font-bold uppercase bg-yellow-300 text-neutral-950 border-2 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                  Inquire
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
