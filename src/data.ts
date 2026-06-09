/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Project, Testimonial, ProcessStep, GearItem } from "./types";

export const SERVICES: Service[] = [
  {
    id: "wedding-photography",
    title: "Wedding Storytelling",
    subtitle: "Candid moments & authentic emotions",
    description: "Full-day wedding photography focusing on real, emotional, and story-driven interactions that feel timeless and cinematic.",
    iconName: "Camera",
    deliverables: ["Shot by Shadman Alif", "Unlimited high-resolution raw captures", "100+ Premium signature graded images", "Private persistent online gallery"],
    startingPrice: "৳45,000 / $550"
  },
  {
    id: "skin-retouching",
    title: "High-End Skin Retouching",
    subtitle: "Magazine-quality modern editing",
    description: "Surgical digital darkroom work highlighting true skin texture, correcting blemishes, dodging & burning, and delivering flawless elegance without looking artificial.",
    iconName: "Sparkles",
    deliverables: ["Advanced frequency separation", "Surgical color balancing & toning", "Non-destructive Photoshop layers", "Quick turnaround remote support"],
    startingPrice: "৳2,500 / $30 per crop"
  },
  {
    id: "cinematic-portraits",
    title: "Cinematic Couple Portraits",
    subtitle: "Artistry in natural light & composition",
    description: "Bespoke pre-wedding or post-wedding portraits that emphasize depth, cinematic atmospheres, creative lighting, and genuine intimacy.",
    iconName: "Heart",
    deliverables: ["Intimate location scouting", "Scenic direction & styling advice", "40+ Custom edited master files", "Social-ready cinematic teasers"],
    startingPrice: "৳20,000 / $250"
  },
  {
    id: "color-correction",
    title: "Lightroom Color Correction",
    subtitle: "Cohesive aesthetic for entire galleries",
    description: "Consistency across thousands of frames. Tailored color-grading, temperature matching, and highlight recovery designed specifically for active studios.",
    iconName: "Sliders",
    deliverables: ["Consistent aesthetic mapping", "White balance & exposure uniformity", "Custom preset creation & application", "High-volume studio support"],
    startingPrice: "৳8 / $0.10 per image"
  },
  {
    id: "remote-editing",
    title: "Remote Editing Support",
    subtitle: "Outsource your busy season load",
    description: "Collaborating remotely with international wedding studios to refine RAW files, manage heavy backlogs, and maintain premium retouching quality under tight budgets.",
    iconName: "Laptop",
    deliverables: ["Dedicated seasonal calendar slot", "Secure cloud file handoff workflow", "Unlimited retouching revisions", "Direct Slack/WhatsApp coordination"],
    startingPrice: "Custom Quote / Retainer"
  },
  {
    id: "destination-weddings",
    title: "Destination Weddings",
    subtitle: "Vagabond love, documented",
    description: "Travel-ready wedding coverage outside of Mymensingh. Specialized in handling unpredictable lighting, traditional heritage setups, and scenic outdoor dynamics.",
    iconName: "Globe",
    deliverables: ["Travel-ready dual camera rigs", "Scenic venue scouting prior to event", "Rehearsal dinner mini shoot", "Handcrafted premium canvas print box"],
    startingPrice: "৳85,000 / $1,000"
  }
];

export const PROJECTS: Project[] = [
  {
    id: "chitroborno-story",
    title: "Timeless Mughal Crimson",
    coupleNames: "Farhan & Shama",
    location: "Heritage Court, Old Dhaka",
    year: "2024",
    category: "traditional",
    mainImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200",
    tagline: "High-end skin retouching & classic warm color grading capturing intense heritage beauty.",
    galleryImages: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  {
    id: "riverine-romance",
    title: "Teesta Riverine Canopy",
    coupleNames: "Sajid & Nusrat",
    location: "Riverbanks, Sylhet",
    year: "2025",
    category: "couple-shoot",
    mainImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    tagline: "Natural, atmospheric pre-wedding session documenting raw companionship under moody monsoon clouds.",
    galleryImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507504038482-7621c518ce65?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  {
    id: "mymensingh-twilight",
    title: "Brahmaputra Evening Glow",
    coupleNames: "Tanvir & Zara",
    location: "Mymensingh, Bangladesh",
    year: "2025",
    category: "photography",
    mainImage: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=1200",
    tagline: "Chasing clean pastel highlights and classic skin retouching along Mymensingh's historic waterfronts.",
    galleryImages: [
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  {
    id: "editorial-skin-retouching",
    title: "Luxury Skin & Preset Mastery",
    coupleNames: "Studio Portfolio",
    location: "Remote Retouching Lab",
    year: "2025",
    category: "traditional",
    mainImage: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200",
    tagline: "Before/After high-end frequency separation and cinematic digital color restoration.",
    galleryImages: [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000"
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    author: "Fardin Ahmed",
    role: "Lead, Chitroborno Team",
    text: "Shadman Alif is an outstanding asset with an exceptional grasp of light and digital editing. His time in the Chitroborno Team showed he cares profoundly about capturing storytelling compositions while delivering top-tier retouching that honors authentic emotions.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    location: "Dhaka, Bangladesh",
    eventDate: "Chitroborno Collab"
  },
  {
    id: "test-2",
    author: "Zayan & Maria",
    role: "Bride & Groom",
    text: "We booked Alif for our wedding in Mymensingh, and the experience was flawless. He worked with serene calm, and the cinematic couple portraits he crafted are treasures we will hold forever. His Photoshop skin-retouch is so fine and natural, it feels completely authentic!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    location: "Mymensingh Ceremony",
    eventDate: "December 2024"
  },
  {
    id: "test-3",
    author: "A. Tremblay",
    role: "Art Director, Studio Montreal",
    text: "Working with Shadman Alif as a remote photo editor has saved our sanity during peak season. He possesses impeccable attention to skin tones, shadow recovery, and color grading consistency. Our wedding clients are thrilled, and his turnarounds are incredibly reliable.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    location: "Remote Editor Collaboration",
    eventDate: "Ongoing Partner"
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: 1,
    title: "Consultation & Vision Planning",
    description: "Story First",
    details: "Every wedding begins with understanding your story, personalities, culture, and vision. We discuss your expectations, preferred style, important moments, and create a clear creative direction before the event day.",
    duration: "Phase 01"
  },
  {
    stepNumber: 2,
    title: "Cinematic Wedding Coverage",
    description: "Real Emotions",
    details: "On the wedding day, I focus on capturing genuine emotions, candid interactions, elegant portraits, family moments, and cinematic details with a storytelling approach that feels natural and timeless.",
    duration: "On Event"
  },
  {
    stepNumber: 3,
    title: "Color Grading & Visual Consistency",
    description: "Cinematic Tone",
    details: "Each image is carefully selected and professionally color graded to maintain a cohesive cinematic aesthetic, balanced skin tones, emotional depth, and premium visual consistency throughout the gallery.",
    duration: "Darkroom"
  },
  {
    stepNumber: 4,
    title: "High-End Retouching",
    description: "Premium Retouch",
    details: "Selected portraits receive detailed retouching and enhancement while preserving natural skin texture and authentic emotions. The goal is clean, elegant, magazine-quality results without looking artificial.",
    duration: "Surgical"
  },
  {
    stepNumber: 5,
    title: "Secure Delivery & Final Experience",
    description: "Timeless Delivery",
    details: "Final edited photographs are delivered through a secure online gallery with organized access, high-resolution downloads, and a smooth viewing experience for couples and families.",
    duration: "Delivery"
  }
];

export const STATS = [
  { value: "150+", label: "Weddings Preserved" },
  { value: "6+ Years", label: "Industry Experience" },
  { value: "12M+", label: "Pixels Retouched surgically" },
  { value: "100%", label: "Heartfelt Contentment" }
];

export const GEAR_ITEMS: GearItem[] = [
  {
    id: "sony-a7iii",
    name: "Sony a7III",
    category: "bodies",
    categoryLabel: "Camera Body",
    specs: "24.2MP • Exmor R CMOS • 5-Axis Stabilization",
    description: "The primary workhorse body. Renowned for low-light execution, dual card slots, and stellar dynamic spectrums to lock raw emotional moments.",
    tag: "Primary Body",
    tagColor: "bg-red-400",
  },
  {
    id: "sigma-85",
    name: "Sigma 85mm DG DN Art",
    category: "lenses",
    categoryLabel: "Portrait Prime Lens",
    specs: "f/1.4 Aperture • Star Sharpness • Ultimate compression",
    description: "Flagship portrait glass. Delivers razor-sharp eyes and majestic background separation with hand-painted editorial bokeh.",
    tag: "Signature Portrait",
    tagColor: "bg-yellow-400",
  },
  {
    id: "samyang-35",
    name: "Samyang 35mm F1.4",
    category: "lenses",
    categoryLabel: "Storytelling Prime Lens",
    specs: "f/1.4 Aperture • High Resolution • Cinematic Vignette",
    description: "Wide, intimate, and classic. Excellent for candid documentary moments, wedding details, and low-light environmental frames.",
    tag: "Cinematic Wide",
    tagColor: "bg-teal-300",
  },
  {
    id: "viltrox-20",
    name: "Viltrox 20mm",
    category: "lenses",
    categoryLabel: "Ultra-Wide Prime Lens",
    specs: "f/1.8 Aperture • Minimal Distortion • Wide Perspective",
    description: "Expansive venue details, epic landscape backgrounds on riverbanks, or crowded reception dance floors without bending lines.",
    tag: "Epic Ultra-Wide",
    tagColor: "bg-indigo-300",
  },
  {
    id: "viltrox-24",
    name: "Viltrox 24mm",
    category: "lenses",
    categoryLabel: "Compact Prime Lens",
    specs: "f/1.8 Aperture • Linear Autofocus • Crisp Contrast",
    description: "A compact prime perfect for unobtrusive coverage during bridal prep, morning tea ceremonies, and warm room candids.",
    tag: "Documentary Lens",
    tagColor: "bg-purple-300",
  },
  {
    id: "kf-ml60",
    name: "K&F ML 60",
    category: "lighting",
    categoryLabel: "COB Video Light",
    specs: "High-CRI Led • Silent Operation • Portable Battery Supported",
    description: "Continuous ultra-quiet light source. Creates gorgeous cinematic textures for short reels, evening teasers, and outdoor cinematic fill.",
    tag: "Continuous Light",
    tagColor: "bg-orange-400",
  },
  {
    id: "godox-850iii",
    name: "Godox V850III Flashes",
    category: "lighting",
    categoryLabel: "Speedlight System",
    specs: "Wireless 2.4G System • Fast Cycle Speed • High Capacity Li-ion",
    description: "High-speed-sync wireless speedlights. Orchestrates complex multi-flash bounce grids to freeze high-energy dance moves and group shots.",
    tag: "Speedlight Setup",
    tagColor: "bg-pink-300",
  },
  {
    id: "phottix-65",
    name: "Phottix 65 Softbox",
    category: "modifiers",
    categoryLabel: "Portable Softbox Modifier",
    specs: "65cm Diameter • Double Layer Inner/Outer Diffusion",
    description: "Double-diffused octagonal softbox creating delicate skin tones and wrap-around beauty highlight rolls for high-fashion portrait spreads.",
    tag: "Main Diffuser",
    tagColor: "bg-emerald-300",
  },
  {
    id: "godox-60-60",
    name: "Godox 60x60 Softbox",
    category: "modifiers",
    categoryLabel: "Grid Modifier",
    specs: "60x60cm Foldable • Detachable Grid Mesh included",
    description: "Controlled, sharp directional spill with a matching honeycomb grid. Excellent for isolating lighting on highlights and moody vignettes.",
    tag: "Grid Spotlight",
    tagColor: "bg-cyan-300",
  },
  {
    id: "macbook-m4",
    name: "MacBook Pro M4",
    category: "workstations",
    categoryLabel: "Editing Workstation",
    specs: "M4 Max/Pro • Liquid Retina XDR • Fully Calibrated Screen",
    description: "My primary workstation for premium fast editing. Handles color grading, complex noise reduction, and heavy-duty 4K video rendering seamlessly.",
    tag: "Pro Editing Rig",
    tagColor: "bg-indigo-300",
  },
];
