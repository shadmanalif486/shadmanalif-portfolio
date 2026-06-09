/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string; // Dynamic lookup for Lucide icons
  deliverables: string[];
  startingPrice: string;
}

export interface Project {
  id: string;
  title: string;
  coupleNames: string;
  location: string;
  year: string;
  category: "photography" | "cinematography" | "couple-shoot" | "traditional";
  mainImage: string;
  tagline: string;
  galleryImages: string[];
  videoUrl?: string; // For cinematographic films representational playback
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  text: string;
  rating: number;
  image: string;
  location: string;
  eventDate: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
  details: string;
}

export interface BookingSubmission {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: string;
  message: string;
}

export interface GearItem {
  id: string;
  name: string;
  category: "bodies" | "lenses" | "lighting" | "modifiers" | "workstations";
  categoryLabel: string;
  specs: string;
  description: string;
  tag: string;
  tagColor: string;
}
