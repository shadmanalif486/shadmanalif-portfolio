/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon, Sparkles, Camera, PhoneCall } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
}

export default function Navbar({ darkMode, onToggleDarkMode, onOpenBooking, onOpenAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Gear", href: "#gear" },
    { name: "Feature", href: "#services" },
    { name: "Blog", href: "#process" },
    { name: "Contact Us", href: "#contact" }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav
        id="navbar-root"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "py-2 bg-white/95 border-b-2 border-neutral-950 shadow-[0px_2px_0px_rgba(0,0,0,1)]"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Elegant Shadman Alif Typographic Logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
            className="flex flex-col items-start group select-none text-left"
          >
            <span className="font-sans text-[18px] sm:text-[21px] font-black uppercase tracking-tight text-neutral-950 duration-300 group-hover:text-yellow-500">
              Shadman Alif
            </span>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-neutral-500 font-bold leading-none mt-1">
              Photographer
            </span>
          </a>

          {/* Clean Desktop Links without border styling - matching screenshot */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.slice(0, 5).map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-sans text-[13px] tracking-wide text-neutral-700 hover:text-neutral-950 font-medium transition-colors relative py-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action buttons matching screenshot style (Contact Us underlined) */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
              className="font-serif text-[14px] font-bold underline text-neutral-950 hover:text-neutral-700 transition-all cursor-pointer decoration-2"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Hamburgers */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-yellow-300 border-2 border-neutral-950 text-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none transition-shadow"
              aria-label="Responsive Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[76px] bg-white border-b-4 border-neutral-950 z-40 shadow-xl overflow-hidden md:hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="font-sans text-lg font-black tracking-wide text-neutral-950 hover:text-yellow-500 transition-colors py-1 block"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="h-[2px] bg-dashed bg-neutral-300 my-1"></div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-500">
                  📍 Based in Mymensingh, BD
                </span>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-mono font-black uppercase bg-yellow-300 text-neutral-950 border-2 border-neutral-950 shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)]"
                >
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Reserve Date</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
