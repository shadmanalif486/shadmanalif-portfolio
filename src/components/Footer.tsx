/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Instagram, Youtube, Facebook, ArrowUp, Camera, Mail, Sliders, Lock, Key } from "lucide-react";

interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-neutral-950 text-white pt-20 pb-12 relative overflow-hidden bg-grain border-t-4 border-solid border-neutral-950">
      
      {/* Absolute faint backdrop watermark */}
      <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 text-white/[0.03] font-mono text-[8rem] md:text-[14rem] select-none font-black tracking-widest pointer-events-none uppercase">
        ALIF PHOTOGRAPHY
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand block */}
          <div className="md:col-span-7 text-left space-y-6">
            <a href="#home" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-yellow-300 border-2 border-neutral-950 flex items-center justify-center text-neutral-950 shadow-[1.5px_1.5px_0px_white]">
                <Camera className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="font-sans text-xl font-black uppercase tracking-wide text-white block">
                  Shadman Alif
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase text-yellow-300 block mt-0.5">
                  Wedding Photo & Retouch
                </span>
              </div>
            </a>
            
            <p className="font-sans text-xs text-neutral-400 font-medium max-w-sm leading-relaxed">
              Awarded personal wedding photography and premium remote editing/retouching services. Preserving honest smiles and deep human atmosphere with pixel perfection.
            </p>
          </div>

          {/* Social Channels on the right side */}
          <div className="md:col-span-5 flex flex-col md:items-end md:justify-center text-left md:text-right space-y-3">
            <h4 className="font-mono text-[9px] tracking-widest uppercase font-extrabold text-[#777]">
              CONNECT & WORK TOGETHER
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/ShadmanAlif123"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-yellow-300 hover:border-yellow-300 rounded-xl transition-all"
                title="Facebook Address"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/shadmanalif1/"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-yellow-300 hover:border-yellow-300 rounded-xl transition-all"
                title="Instagram Address"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:shadmanalif486@gmail.com"
                className="p-3 bg-neutral-900 border border-neutral-801 text-neutral-400 hover:text-yellow-300 hover:border-yellow-300 rounded-xl transition-all"
                title="Email Direct"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer base row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10">
          
          <div className="text-xs font-sans text-neutral-500 text-center sm:text-left font-medium space-y-1">
            <p>© {currentYear} Shadman Alif. All rights reserved.</p>
            <p className="text-[10px] text-neutral-600 mt-1 uppercase tracking-widest font-mono font-bold flex items-center justify-center sm:justify-start gap-1">
              <span>Crafting photographs that people feel.</span>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="p-1 text-neutral-600 hover:text-yellow-300 transition-colors cursor-pointer bg-transparent border-none flex items-center justify-center"
                  title="Admin Panel"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>
              )}
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-300 text-neutral-950 font-mono text-xs font-black uppercase rounded-xl border-2 border-neutral-950 shadow-[2px_2px_0px_white] hover:translate-y-[-1px] transition-transform cursor-pointer"
            title="Scroll up"
          >
            <span>Peak</span>
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>

        </div>

      </div>
    </footer>
  );
}
