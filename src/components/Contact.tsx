/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, Mail, MessageSquare, ExternalLink, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { BookingSubmission } from "../types";

interface ContactProps {
  initialFormState?: Partial<BookingSubmission> | null;
  onNewBooking?: (booking: BookingSubmission) => void;
}

export default function Contact({ initialFormState, onNewBooking }: ContactProps) {
  const [form, setForm] = useState<BookingSubmission>({
    name: "",
    email: "",
    phone: "",
    eventType: "wedding-photography",
    eventDate: "",
    budget: "৳20,000 - ৳50,000",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync if prefilled via details modal
  useEffect(() => {
    if (initialFormState) {
      setForm((prev) => ({ ...prev, ...initialFormState }));
    }
  }, [initialFormState]);

  const handleWhatsAppClick = () => {
    let textPrompt = "Hello Shadman Alif! I am interested in booking your wedding photography or professional retouching services.";

    // If form values exist, format them beautifully for the photographer
    if (form.name || form.phone || form.message) {
      const parts = [
        "Hello Shadman Alif!",
        "I'd love to consult with you about a creative commission. Here are my details:",
        `- Name: ${form.name || "Not specified"}`,
        `- Phone: ${form.phone || "Not specified"}`,
        `- Email: ${form.email || "Not specified"}`,
        `- Requested Service: ${form.eventType === "wedding-photography" ? "Wedding Storytelling" : form.eventType === "skin-retouching" ? "High-End Skin Retouching" : form.eventType === "cinematic-portraits" ? "Cinematic Couple Portraits" : form.eventType === "color-correction" ? "Lightroom Color Correction" : "Remote Editing Support"}`,
        `- Proposed Date: ${form.eventDate || "Not specified"}`,
        `- Budget Tier: ${form.budget}`,
      ];

      if (form.message) {
        parts.push(`- Message: "${form.message}"`);
      }

      textPrompt = parts.join("\n");
    }

    const encoded = encodeURIComponent(textPrompt);
    window.open(`https://wa.me/8801876915244?text=${encoded}`, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWhatsAppClick();
  };

  return (
    <section id="contact" className="py-24 bg-[#FAF9F6] border-t-4 border-neutral-950 relative overflow-hidden">
      <div className="absolute top-[20%] left-[5%] w-72 h-72 bg-yellow-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Coordinates & Tilted Folded Parchment Map */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <div className="px-3 py-1 bg-yellow-300 border-2 border-neutral-950 font-mono text-xs font-bold uppercase tracking-widest text-[#121212] shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-4 w-fit">
                Get In Touch
              </div>
              
              <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-[#121212] tracking-tight leading-none mb-6">
                <span className="relative inline-block">
                  Where Can You Find Me?
                  <svg
                    className="absolute -bottom-3 left-0 w-80 h-[10px] text-yellow-300"
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

              <p className="font-sans text-sm text-neutral-600 font-semibold leading-relaxed mt-6">
                Currently taking commissions for wedding events across Bangladesh and global remote retouching support. Drop me a line directly.
              </p>
            </div>

            {/* Tactile Coordinates Stack */}
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-white border-2 border-neutral-950 shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-2xl">
                <div className="h-10 w-10 bg-yellow-300 text-neutral-950 border-2 border-neutral-950 flex items-center justify-center rounded-xl shrink-0 shadow-[1px_1px_rgba(0,0,0,1)]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase font-extrabold text-neutral-400">Atelier Location</h4>
                  <p className="font-sans text-xs sm:text-sm text-neutral-950 font-bold mt-0.5">Kachijuli, Mymensingh, Bangladesh</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white border-2 border-neutral-950 shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-2xl">
                <div className="h-10 w-10 bg-teal-300 text-neutral-950 border-2 border-neutral-950 flex items-center justify-center rounded-xl shrink-0 shadow-[1px_1px_rgba(0,0,0,1)]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase font-extrabold text-neutral-400">Direct Mobile / Whatsapp</h4>
                  <p className="font-sans text-xs sm:text-sm text-neutral-950 font-bold mt-0.5">01876915244</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white border-2 border-neutral-950 shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-2xl">
                <div className="h-10 w-10 bg-red-400 text-neutral-950 border-2 border-neutral-950 flex items-center justify-center rounded-xl shrink-0 shadow-[1px_1px_rgba(0,0,0,1)]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase font-extrabold text-neutral-400">Personal Inbox</h4>
                  <p className="font-sans text-xs sm:text-sm text-neutral-950 font-bold mt-0.5">shadmanalif486@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Folded Adventure Parchment Map Layout exactly matching the user's mockup style */}
            <div className="relative pt-6">
              {/* Backing color board */}
              <div className="absolute inset-0 bg-yellow-300 border-3 border-neutral-950 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-2xl transform -rotate-2" />
              
              {/* Primary Map Box slightly tilted */}
              <div className="relative h-64 border-3 border-neutral-950 rounded-2xl overflow-hidden bg-white z-10 p-2 transform rotate-1">
                <iframe
                  title="Shadman Alif Studio Location Map"
                  src="https://maps.google.com/maps?q=Kachijuli,%20Mymensingh,%20Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-none rounded-xl pointer-events-auto grayscale-20"
                  allowFullScreen
                  loading="lazy"
                />

                {/* Overlapping Tooltip banner from screenshot: "Kachijuli Mymensingh, Bangladesh - OPEN IN MAP" */}
                <div className="absolute bottom-4 left-4 right-4 bg-white border-2 border-neutral-950 p-2.5 rounded-xl shadow-[3px_3px_0px_#121212] z-20 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="text-[10px] font-mono font-bold uppercase text-neutral-400">MY STUDIO</p>
                    <p className="text-[11px] font-sans font-black text-neutral-950 leading-tight">Kachijuli, Mymensingh</p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Kachijuli,Mymensingh,Bangladesh"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 bg-yellow-300 text-[10px] font-mono font-extrabold uppercase border border-neutral-950 rounded shadow-[1.5px_1.5px_0px_#121212]"
                  >
                    Open In Map
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Custom Tactical Booking Form */}
          <div className="lg:col-span-7 relative">
            <div className="absolute inset-0 bg-neutral-950 border-3 border-neutral-950 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl transform translate-x-3 translate-y-3" />
            
            <div className="relative bg-white border-3 border-neutral-950 rounded-3xl p-8 md:p-11 z-10 text-left flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <form
                    key="reservation-form"
                    onSubmit={handleSubmit}
                    className="space-y-6 w-full"
                  >
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <span className="text-[10px] tracking-widest font-mono font-extrabold text-neutral-400 uppercase">Interactive Reservation Portal</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="form-name" className="text-[10px] font-mono font-extrabold uppercase tracking-wide text-neutral-500">
                          Your Complete Name *
                        </label>
                        <input
                          id="form-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Shadman Alif"
                          className="p-3 w-full border-2 border-neutral-950 text-sm font-sans font-bold focus:outline-none focus:bg-yellow-101/20 transition-all rounded-lg"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="form-email" className="text-[10px] font-mono font-extrabold uppercase tracking-wide text-neutral-500">
                          Your Active Email *
                        </label>
                        <input
                          id="form-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="e.g. custom@gmail.com"
                          className="p-3 w-full border-2 border-neutral-950 text-sm font-sans font-bold focus:outline-none focus:bg-yellow-101/20 transition-all rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="form-phone" className="text-[10px] font-mono font-extrabold uppercase tracking-wide text-neutral-500">
                          Active WhatsApp / Cell *
                        </label>
                        <input
                          id="form-phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="e.g. 01876-915244"
                          className="p-3 w-full border-2 border-neutral-950 text-sm font-sans font-bold focus:outline-none focus:bg-yellow-101/20 transition-all rounded-lg"
                        />
                      </div>

                      {/* Event Type Select */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="form-event-type" className="text-[10px] font-mono font-extrabold uppercase tracking-wide text-neutral-500">
                          Desired Service Type
                        </label>
                        <select
                          id="form-event-type"
                          value={form.eventType}
                          onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                          className="p-3 w-full border-2 border-neutral-950 text-sm font-sans font-bold focus:outline-none focus:bg-yellow-101/20 transition-all rounded-lg bg-white"
                        >
                          <option value="wedding-photography">Wedding Storytelling</option>
                          <option value="skin-retouching">High-End Skin Retouching</option>
                          <option value="cinematic-portraits">Cinematic Couple Portraits</option>
                          <option value="color-correction">Lightroom Color Correction</option>
                          <option value="remote-editing">Remote Editing Support</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Event Date */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="form-date" className="text-[10px] font-mono font-extrabold uppercase tracking-wide text-neutral-500">
                          Proposed Commission Date
                        </label>
                        <input
                          id="form-date"
                          type="date"
                          value={form.eventDate}
                          onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                          className="p-3 w-full border-2 border-neutral-950 text-sm font-sans font-bold focus:outline-none rounded-lg"
                        />
                      </div>

                      {/* Budget Scale */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="form-budget" className="text-[10px] font-mono font-extrabold uppercase tracking-wide text-neutral-500">
                          Planned Budget Tier
                        </label>
                        <select
                          id="form-budget"
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          className="p-3 w-full border-2 border-neutral-950 text-sm font-sans font-bold focus:outline-none rounded-lg bg-white"
                        >
                          <option value="৳5,000 - ৳15,000">Retouch/Editing Work (under ৳15k)</option>
                          <option value="৳15,000 - ৳40,000">Portraits / Mini Session (under ৳40k)</option>
                          <option value="৳40,000 - ৳80,000">Signature Wedding Story (under ৳80k)</option>
                          <option value="৳80,000+">Destination Wedding Coverage (৳80k+)</option>
                        </select>
                      </div>
                    </div>

                    {/* Message Details */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="form-[2]" className="text-[10px] font-mono font-extrabold uppercase tracking-wide text-neutral-500">
                        Aesthetic Details & Story Ideas
                      </label>
                      <textarea
                        id="form-[2]"
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Share your wedding plans, retouch limits, or international studio timeline requirements."
                        className="p-3 w-full border-2 border-neutral-950 text-sm font-sans font-bold focus:outline-none rounded-lg resize-none focus:bg-yellow-101/20 transition-all"
                      />
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full px-8 py-4.5 bg-emerald-400 hover:bg-emerald-500 text-[#121212] font-sans text-sm font-black uppercase tracking-wider border-3 border-neutral-950 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
                      >
                        <MessageSquare className="w-5 h-5 fill-none stroke-[2.5]" />
                        <span>Instant Whatsapp</span>
                      </button>
                    </div>

                  </form>
                ) : (
                  <motion.div
                    key="composing-success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-teal-100 text-neutral-950 border-3 border-neutral-950 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center rounded-3xl">
                      <CheckCircle2 className="w-10 h-10 text-teal-500" />
                    </div>
                    <div>
                      <h3 className="font-sans text-2xl font-black text-[#121212] mb-2">
                        Query Safely Delivered
                      </h3>
                      <p className="font-sans text-sm text-neutral-600 font-semibold max-w-sm mx-auto leading-relaxed">
                        Thank you! I have received your wedding details or editing work. I’ll review my pipeline schedules and email you in Mymensingh/Dhaka workspace times.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 bg-yellow-300 text-neutral-950 border-2 border-neutral-950 text-xs font-mono font-extrabold uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] cursor-pointer"
                    >
                      Draft Another Request
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
