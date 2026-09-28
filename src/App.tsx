/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Info, Shield, Sparkles, Send } from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Gear from "./components/Gear";
import FeaturedWork from "./components/FeaturedWork";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Process from "./components/Process";
import Contact from "./components/Contact";
import Lightbox from "./components/Lightbox";
import Footer from "./components/Footer";

import { Project, Service, BookingSubmission, Testimonial, GearItem } from "./types";
import { SERVICES, PROJECTS, TESTIMONIALS, GEAR_ITEMS } from "./data";
import AdminPanel from "./components/AdminPanel";
import { auth } from "./lib/firebase";
import { 
  fetchConfig, saveConfig, 
  fetchServices, saveService, removeService,
  fetchProjects, saveProject, removeProject,
  fetchTestimonials, saveTestimonial, removeTestimonial,
  fetchGearItems, saveGearItem, removeGearItem,
  fetchBookings, saveBooking, removeBooking
} from "./lib/firestoreService";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [startWithVideo, setStartWithVideo] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingPrefill, setBookingPrefill] = useState<Partial<BookingSubmission> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic States for administrative panel
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  const [dynServices, setDynServices] = useState<Service[]>(() => {
    const deletedIds: string[] = (() => {
      try { return JSON.parse(localStorage.getItem("admin_deleted_services_ids") || "[]"); } catch { return []; }
    })();
    const saved = localStorage.getItem("admin_services");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(s => !deletedIds.includes(s.id));
        }
      } catch (e) {}
    }
    return SERVICES.filter(s => !deletedIds.includes(s.id));
  });

  const [dynProjects, setDynProjects] = useState<Project[]>(() => {
    const deletedIds: string[] = (() => {
      try { return JSON.parse(localStorage.getItem("admin_deleted_project_ids") || "[]"); } catch { return []; }
    })();
    try {
      const saved = localStorage.getItem("admin_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Permanently purge any legacy demo unsplash projects or demo placeholders
          const cleanProjects = parsed.filter((p: any) =>
            !deletedIds.includes(p.id) &&
            !p.mainImage?.includes("unsplash.com") &&
            p.coupleNames !== "Farhan & Shama" &&
            p.coupleNames !== "Sajid & Nusrat" &&
            p.coupleNames !== "Tanvir & Zara" &&
            p.coupleNames !== "Studio Portfolio"
          );
          if (cleanProjects.length > 0) {
            return cleanProjects;
          }
        }
      }
    } catch (e) {
      // fallback
    }
    const initialClean = PROJECTS.filter(p => !deletedIds.includes(p.id));
    try {
      localStorage.setItem("admin_projects", JSON.stringify(initialClean));
    } catch (e) {}
    return initialClean;
  });

  const [dynTestimonials, setDynTestimonials] = useState<Testimonial[]>(() => {
    const deletedIds: string[] = (() => {
      try { return JSON.parse(localStorage.getItem("admin_deleted_testimonials_ids") || "[]"); } catch { return []; }
    })();
    const saved = localStorage.getItem("admin_testimonials");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(t => !deletedIds.includes(t.id));
        }
      } catch (e) {}
    }
    return TESTIMONIALS.filter(t => !deletedIds.includes(t.id));
  });

  const [dynBookings, setDynBookings] = useState<BookingSubmission[]>(() => {
    const saved = localStorage.getItem("admin_bookings");
    return saved ? JSON.parse(saved) : [];
  });

  const [dynGearItems, setDynGearItems] = useState<GearItem[]>(() => {
    const saved = localStorage.getItem("admin_gear_items");
    if (saved) {
      const items = JSON.parse(saved) as GearItem[];
      if (!items.some((g) => g.id === "macbook-m4")) {
        const m4Gear = GEAR_ITEMS.find((g) => g.id === "macbook-m4");
        if (m4Gear) {
          const updated = [...items, m4Gear];
          localStorage.setItem("admin_gear_items", JSON.stringify(updated));
          return updated;
        }
      }
      return items;
    }
    return GEAR_ITEMS;
  });

  const [heroImageUrl, setHeroImageUrl] = useState(() => {
    const saved = localStorage.getItem("admin_hero_image_url");
    if (saved && !saved.includes("input_file_1.png") && !saved.includes("unsplash.com")) {
      return saved;
    }
    return "https://res.cloudinary.com/db3uewokh/image/upload/v1781327270/d0d1d917-207d-4e1f-b11f-ae382c03f31a_moy66c.png";
  });

  const [homeTitle, setHomeTitle] = useState(() => {
    return localStorage.getItem("admin_home_title") || "Capturing beauty photo";
  });

  const [aboutMeImageUrl, setAboutMeImageUrl] = useState(() => {
    const saved = localStorage.getItem("admin_about_me_image_url");
    if (saved && !saved.includes("unsplash.com")) {
      return saved;
    }
    return "https://res.cloudinary.com/db3uewokh/image/upload/v1781327286/111_owybwv.jpg";
  });

  const [aboutCollabImageUrl, setAboutCollabImageUrl] = useState(() => {
    return localStorage.getItem("admin_about_collab_image_url") || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=95&w=1200";
  });

  const [aboutMeImageFit, setAboutMeImageFit] = useState(() => {
    return localStorage.getItem("admin_about_me_image_fit") || "cover";
  });

  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(() => {
    return localStorage.getItem("cloudinary_cloud_name") || "db3uewokh";
  });

  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState(() => {
    return localStorage.getItem("cloudinary_upload_preset") || "wedding_preset";
  });

  // Track Firebase connection
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Cloud data on start (highly optimized)
  useEffect(() => {
    async function loadCloudData() {
      try {
        const config = await fetchConfig();
        if (config) {
          if (config.heroImageUrl) {
            setHeroImageUrl(config.heroImageUrl);
            localStorage.setItem("admin_hero_image_url", config.heroImageUrl);
          }
          if (config.homeTitle) {
            setHomeTitle(config.homeTitle);
            localStorage.setItem("admin_home_title", config.homeTitle);
          }
          if (config.aboutMeImageUrl) {
            setAboutMeImageUrl(config.aboutMeImageUrl);
            localStorage.setItem("admin_about_me_image_url", config.aboutMeImageUrl);
          }
          if (config.aboutCollabImageUrl) {
            setAboutCollabImageUrl(config.aboutCollabImageUrl);
            localStorage.setItem("admin_about_collab_image_url", config.aboutCollabImageUrl);
          }
          if (config.aboutMeImageFit) {
            setAboutMeImageFit(config.aboutMeImageFit);
            localStorage.setItem("admin_about_me_image_fit", config.aboutMeImageFit);
          }
          if (config.cloudinaryCloudName) {
            setCloudinaryCloudName(config.cloudinaryCloudName);
            localStorage.setItem("cloudinary_cloud_name", config.cloudinaryCloudName);
          }
          if (config.cloudinaryUploadPreset) {
            setCloudinaryUploadPreset(config.cloudinaryUploadPreset);
            localStorage.setItem("cloudinary_upload_preset", config.cloudinaryUploadPreset);
          }
        }

        const clServices = await fetchServices();
        if (clServices && clServices.length > 0) {
          const deletedServices: string[] = (() => {
            try { return JSON.parse(localStorage.getItem("admin_deleted_services_ids") || "[]"); } catch { return []; }
          })();
          const cleanServices = clServices.filter(s => !deletedServices.includes(s.id));
          setDynServices(cleanServices);
          localStorage.setItem("admin_services", JSON.stringify(cleanServices));
        }

        const clProjects = await fetchProjects();
        if (clProjects && clProjects.length > 0) {
          const deletedProjects: string[] = (() => {
            try { return JSON.parse(localStorage.getItem("admin_deleted_project_ids") || "[]"); } catch { return []; }
          })();
          // Permanently purge any legacy demo projects and user-deleted projects
          const cleanProjects = clProjects.filter((p: any) =>
            !deletedProjects.includes(p.id) &&
            !p.mainImage?.includes("unsplash.com") &&
            p.coupleNames !== "Farhan & Shama" &&
            p.coupleNames !== "Sajid & Nusrat" &&
            p.coupleNames !== "Tanvir & Zara" &&
            p.coupleNames !== "Studio Portfolio"
          );
          if (cleanProjects.length > 0) {
            setDynProjects(cleanProjects);
            localStorage.setItem("admin_projects", JSON.stringify(cleanProjects));
          }
        }

        const clTestimonials = await fetchTestimonials();
        if (clTestimonials && clTestimonials.length > 0) {
          const deletedTestimonials: string[] = (() => {
            try { return JSON.parse(localStorage.getItem("admin_deleted_testimonials_ids") || "[]"); } catch { return []; }
          })();
          const cleanTestimonials = clTestimonials.filter(t => !deletedTestimonials.includes(t.id));
          setDynTestimonials(cleanTestimonials);
          localStorage.setItem("admin_testimonials", JSON.stringify(cleanTestimonials));
        }

        const clGear = await fetchGearItems();
        if (clGear && clGear.length > 0) {
          const deletedGear: string[] = (() => {
            try { return JSON.parse(localStorage.getItem("admin_deleted_gear_ids") || "[]"); } catch { return []; }
          })();
          const cleanGear = clGear.filter(g => !deletedGear.includes(g.id));
          setDynGearItems(cleanGear);
          localStorage.setItem("admin_gear_items", JSON.stringify(cleanGear));
        }

        if (auth.currentUser && auth.currentUser.email === "shadmanalif486@gmail.com") {
          const clBookings = await fetchBookings();
          if (clBookings) {
            setDynBookings(clBookings);
            localStorage.setItem("admin_bookings", JSON.stringify(clBookings));
          }
        }
      } catch (err) {
        console.warn("Could not retrieve Firestore collections, fallback to cached states", err);
      }
    }
    loadCloudData();
  }, [firebaseUser]);

  const syncConfig = async (
    hero: string,
    title: string,
    aboutMe: string,
    collab: string,
    fit: string,
    cloudNameVal?: string,
    uploadPresetVal?: string
  ) => {
    try {
      await saveConfig({
        heroImageUrl: hero,
        homeTitle: title,
        aboutMeImageUrl: aboutMe,
        aboutCollabImageUrl: collab,
        aboutMeImageFit: fit,
        cloudinaryCloudName: cloudNameVal ?? cloudinaryCloudName,
        cloudinaryUploadPreset: uploadPresetVal ?? cloudinaryUploadPreset
      });
    } catch (e) {
      console.warn("Cloud Config Sync deferred:", e);
    }
  };

  const handleUpdateCloudinary = (name: string, preset: string) => {
    setCloudinaryCloudName(name);
    setCloudinaryUploadPreset(preset);
    localStorage.setItem("cloudinary_cloud_name", name);
    localStorage.setItem("cloudinary_upload_preset", preset);
    syncConfig(heroImageUrl, homeTitle, aboutMeImageUrl, aboutCollabImageUrl, aboutMeImageFit, name, preset);
  };

  const handleUpdateServices = async (newServices: Service[]) => {
    setDynServices(newServices);
    localStorage.setItem("admin_services", JSON.stringify(newServices));
    const removed = dynServices.filter(s => !newServices.some(ns => ns.id === s.id));
    if (removed.length > 0) {
      try {
        const currentDeleted: string[] = JSON.parse(localStorage.getItem("admin_deleted_services_ids") || "[]");
        const newlyRemovedIds = removed.map(r => r.id);
        const allDeleted = Array.from(new Set([...currentDeleted, ...newlyRemovedIds]));
        localStorage.setItem("admin_deleted_services_ids", JSON.stringify(allDeleted));
      } catch (e) {}
      showToast("সার্ভিস সফলভাবে ডিলিট করা হয়েছে!");
    } else {
      showToast("সার্ভিস তালিকা সফলভাবে আপডেট হয়েছে!");
    }
    try {
      for (const s of newServices) {
        await saveService(s);
      }
      for (const r of removed) {
        await removeService(r.id);
      }
    } catch (e) {
      console.warn("Cloud Sync services deferred:", e);
    }
  };

  const handleUpdateProjects = async (newProjects: Project[]) => {
    setDynProjects(newProjects);
    localStorage.setItem("admin_projects", JSON.stringify(newProjects));
    const removed = dynProjects.filter(p => !newProjects.some(np => np.id === p.id));
    if (removed.length > 0) {
      try {
        const currentDeleted: string[] = JSON.parse(localStorage.getItem("admin_deleted_project_ids") || "[]");
        const newlyRemovedIds = removed.map(r => r.id);
        const allDeleted = Array.from(new Set([...currentDeleted, ...newlyRemovedIds]));
        localStorage.setItem("admin_deleted_project_ids", JSON.stringify(allDeleted));
      } catch (e) {}
      showToast("পোর্টফোলিও সফলভাবে ডিলিট করা হয়েছে!");
    } else {
      showToast("পোর্টফোলিও তালিকা সফলভাবে আপডেট হয়েছে!");
    }
    try {
      for (const p of newProjects) {
        await saveProject(p);
      }
      for (const r of removed) {
        await removeProject(r.id);
      }
    } catch (e) {
      console.warn("Cloud Sync projects deferred:", e);
    }
  };

  const handleUpdateTestimonials = async (newTestimonials: Testimonial[]) => {
    setDynTestimonials(newTestimonials);
    localStorage.setItem("admin_testimonials", JSON.stringify(newTestimonials));
    const removed = dynTestimonials.filter(t => !newTestimonials.some(nt => nt.id === t.id));
    if (removed.length > 0) {
      try {
        const currentDeleted: string[] = JSON.parse(localStorage.getItem("admin_deleted_testimonials_ids") || "[]");
        const newlyRemovedIds = removed.map(r => r.id);
        const allDeleted = Array.from(new Set([...currentDeleted, ...newlyRemovedIds]));
        localStorage.setItem("admin_deleted_testimonials_ids", JSON.stringify(allDeleted));
      } catch (e) {}
      showToast("রিভিউ সফলভাবে ডিলিট করা হয়েছে!");
    } else {
      showToast("রিভিউ তালিকা সফলভাবে আপডেট হয়েছে!");
    }
    try {
      for (const t of newTestimonials) {
        await saveTestimonial(t);
      }
      for (const r of removed) {
        await removeTestimonial(r.id);
      }
    } catch (e) {
      console.warn("Cloud Sync testimonials deferred:", e);
    }
  };

  const handleNewBooking = async (newBooking: BookingSubmission) => {
    const updated = [newBooking, ...dynBookings];
    setDynBookings(updated);
    localStorage.setItem("admin_bookings", JSON.stringify(updated));
    showToast("বুকিং রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে!");
    try {
      await saveBooking(newBooking);
    } catch (e) {
      console.warn("Bookings Cloud storage deferred", e);
    }
  };

  const handleUpdateHeroImageUrl = (url: string) => {
    setHeroImageUrl(url);
    localStorage.setItem("admin_hero_image_url", url);
    syncConfig(url, homeTitle, aboutMeImageUrl, aboutCollabImageUrl, aboutMeImageFit);
  };

  const handleUpdateHomeTitle = (title: string) => {
    setHomeTitle(title);
    localStorage.setItem("admin_home_title", title);
    syncConfig(heroImageUrl, title, aboutMeImageUrl, aboutCollabImageUrl, aboutMeImageFit);
  };

  const handleUpdateAboutMeImageUrl = (url: string) => {
    setAboutMeImageUrl(url);
    localStorage.setItem("admin_about_me_image_url", url);
    syncConfig(heroImageUrl, homeTitle, url, aboutCollabImageUrl, aboutMeImageFit);
  };

  const handleUpdateAboutCollabImageUrl = (url: string) => {
    setAboutCollabImageUrl(url);
    localStorage.setItem("admin_about_collab_image_url", url);
    syncConfig(heroImageUrl, homeTitle, aboutMeImageUrl, url, aboutMeImageFit);
  };

  const handleUpdateAboutMeImageFit = (fit: string) => {
    setAboutMeImageFit(fit);
    localStorage.setItem("admin_about_me_image_fit", fit);
    syncConfig(heroImageUrl, homeTitle, aboutMeImageUrl, aboutCollabImageUrl, fit);
  };

  const handleUpdateGearItems = async (newGearItems: GearItem[]) => {
    setDynGearItems(newGearItems);
    localStorage.setItem("admin_gear_items", JSON.stringify(newGearItems));
    const removed = dynGearItems.filter(g => !newGearItems.some(ng => ng.id === g.id));
    if (removed.length > 0) {
      try {
        const currentDeleted: string[] = JSON.parse(localStorage.getItem("admin_deleted_gear_ids") || "[]");
        const newlyRemovedIds = removed.map(r => r.id);
        const allDeleted = Array.from(new Set([...currentDeleted, ...newlyRemovedIds]));
        localStorage.setItem("admin_deleted_gear_ids", JSON.stringify(allDeleted));
      } catch (e) {}
      showToast("গিয়ার সফলভাবে ডিলিট করা হয়েছে!");
    } else {
      showToast("গিয়ার তালিকা সফলভাবে আপডেট হয়েছে!");
    }
    try {
      for (const g of newGearItems) {
        await saveGearItem(g);
      }
      for (const r of removed) {
        await removeGearItem(r.id);
      }
    } catch (e) {
      console.warn("Cloud Sync gear items deferred:", e);
    }
  };

  const handleSyncLocalToCloud = async (): Promise<boolean> => {
    try {
      // 1. Sync home configuration group
      await saveConfig({
        heroImageUrl,
        homeTitle,
        aboutMeImageUrl,
        aboutCollabImageUrl,
        aboutMeImageFit,
        cloudinaryCloudName,
        cloudinaryUploadPreset
      });

      // 2. Sync services
      for (const s of dynServices) {
        await saveService(s);
      }
      const deletedServices: string[] = JSON.parse(localStorage.getItem("admin_deleted_services_ids") || "[]");
      for (const id of deletedServices) {
        await removeService(id);
      }

      // 3. Sync projects
      for (const p of dynProjects) {
        await saveProject(p);
      }
      const deletedProjects: string[] = JSON.parse(localStorage.getItem("admin_deleted_project_ids") || "[]");
      for (const id of deletedProjects) {
        await removeProject(id);
      }

      // 4. Sync testimonials
      for (const t of dynTestimonials) {
        await saveTestimonial(t);
      }
      const deletedTestimonials: string[] = JSON.parse(localStorage.getItem("admin_deleted_testimonials_ids") || "[]");
      for (const id of deletedTestimonials) {
        await removeTestimonial(id);
      }

      // 5. Sync gear items
      for (const g of dynGearItems) {
        await saveGearItem(g);
      }
      const deletedGear: string[] = JSON.parse(localStorage.getItem("admin_deleted_gear_ids") || "[]");
      for (const id of deletedGear) {
        await removeGearItem(id);
      }
      for (const g of dynGearItems) {
        await saveGearItem(g);
      }

      showToast("সব লোকাল ডাটা সফলভাবে গুগল ক্লাউড ডাটাবেসে সিঙ্ক করা হয়েছে!");
      return true;
    } catch (err) {
      console.error("Force sync failed", err);
      showToast("সিঙ্ক করার সময় সমস্যা হয়েছে!");
      throw err;
    }
  };

  // Initial loading delay with cool rotating camera lens placeholder
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Automatic migration of /input_file style localized files to Cloudinary cloud hosting
  useEffect(() => {
    async function migrateLocalImages() {
      if (!cloudinaryCloudName || !cloudinaryUploadPreset || cloudinaryUploadPreset === "ml_default") {
        return;
      }

      let updated = false;
      let newHero = heroImageUrl;
      let newAboutMe = aboutMeImageUrl;
      let newAboutCollab = aboutCollabImageUrl;

      const needsHeroMigration = heroImageUrl && heroImageUrl.startsWith("/input_file");
      const needsAboutMeMigration = aboutMeImageUrl && aboutMeImageUrl.startsWith("/input_file");
      const needsAboutCollabMigration = aboutCollabImageUrl && aboutCollabImageUrl.startsWith("/input_file");

      if (!needsHeroMigration && !needsAboutMeMigration && !needsAboutCollabMigration) {
        return;
      }

      async function uploadToCloudinary(localPath: string): Promise<string | null> {
        try {
          console.log(`Auto-migrating local asset ${localPath} to Cloudinary...`);
          const response = await fetch(localPath);
          if (!response.ok) throw new Error(`Failed to fetch local file ${localPath}`);
          const blob = await response.blob();

          const formData = new FormData();
          formData.append("file", blob, "uploaded_image.png");
          formData.append("upload_preset", cloudinaryUploadPreset);

          const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName.trim()}/image/upload`, {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            const errData = await uploadRes.json().catch(() => ({}));
            throw new Error(errData.error?.message || "Cloudinary upload failed");
          }

          const data = await uploadRes.json();
          if (data.secure_url) {
            console.log(`Success! Local asset ${localPath} migrated to:`, data.secure_url);
            return data.secure_url;
          }
        } catch (err) {
          console.error(`Error auto-migrating ${localPath}:`, err);
        }
        return null;
      }

      if (needsHeroMigration) {
        const url = await uploadToCloudinary(heroImageUrl);
        if (url) {
          newHero = url;
          updated = true;
        }
      }

      if (needsAboutMeMigration) {
        const url = await uploadToCloudinary(aboutMeImageUrl);
        if (url) {
          newAboutMe = url;
          updated = true;
        }
      }

      if (needsAboutCollabMigration) {
        const url = await uploadToCloudinary(aboutCollabImageUrl);
        if (url) {
          newAboutCollab = url;
          updated = true;
        }
      }

      if (updated) {
        setHeroImageUrl(newHero);
        localStorage.setItem("admin_hero_image_url", newHero);
        setAboutMeImageUrl(newAboutMe);
        localStorage.setItem("admin_about_me_image_url", newAboutMe);
        setAboutCollabImageUrl(newAboutCollab);
        localStorage.setItem("admin_about_collab_image_url", newAboutCollab);

        await saveConfig({
          heroImageUrl: newHero,
          homeTitle,
          aboutMeImageUrl: newAboutMe,
          aboutCollabImageUrl: newAboutCollab,
          aboutMeImageFit,
          cloudinaryCloudName,
          cloudinaryUploadPreset
        });
        showToast("লোকাল ছবি সফলভাবে আপনার ক্লাউডিনারিতে আপলোড করে সিঙ্ক করা হয়েছে!");
      }
    }

    if (!loading) {
      migrateLocalImages();
    }
  }, [loading, heroImageUrl, aboutMeImageUrl, aboutCollabImageUrl, cloudinaryCloudName, cloudinaryUploadPreset]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenBookingWithPrefill = (servicePrefill?: Partial<BookingSubmission>) => {
    if (servicePrefill) {
      setBookingPrefill(servicePrefill);
    }
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenTeaserVideo = () => {
    const spotlightProject: Project = {
      id: "brand-teaser",
      title: "Shadman Alif Cinematic Showcase",
      coupleNames: "Visual Showcase 2026",
      location: "Brahmaputra Scenic Waterfronts",
      year: "2026",
      category: "photography",
      mainImage: heroImageUrl || "https://res.cloudinary.com/db3uewokh/image/upload/v1781327270/d0d1d917-207d-4e1f-b11f-ae382c03f31a_moy66c.png",
      tagline: "A selection of raw emotions, warm shadows, and premium skins.",
      galleryImages: [],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    };
    setSelectedProject(spotlightProject);
    setStartWithVideo(true);
    showToast("Launching Cinematic Teaser Clip");
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-neutral-900 font-sans selection:bg-yellow-300 selection:text-neutral-950 transition-colors duration-300">
      
      {/* 1. COMIC STYLE INTRO SPLASH */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 bg-neutral-950 z-[100] flex flex-col items-center justify-center text-white"
          >
            <div className="text-center space-y-6 max-w-lg px-6">
              
              {/* Spinning loading camera outline */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-2xl border-3 border-dashed border-yellow-300 flex items-center justify-center mx-auto"
              >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-red-400" />
              </motion.div>

              <div className="space-y-1">
                <motion.h1
                  initial={{ letterSpacing: "0.1em", opacity: 0 }}
                  animate={{ letterSpacing: "0.2em", opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="font-sans text-3xl sm:text-4xl font-black uppercase text-white"
                >
                  SHADMAN ALIF
                </motion.h1>
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-yellow-300 font-bold">
                  Wedding Photo & Retouch Studio
                </p>
              </div>

              <div className="h-[2px] w-28 bg-neutral-800 mx-auto rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="h-full bg-yellow-300"
                />
              </div>

              <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
                “PRESENSING EMOTIONS IN AUTHENTIC STRIP”
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Core Viewport */}
      <div className="bg-grain min-h-screen">
        
        {/* Navigation */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => {}}
          onOpenBooking={() => handleOpenBookingWithPrefill()}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Home Block */}
        <Hero
          onOpenBooking={() => handleOpenBookingWithPrefill()}
          onOpenVideo={handleOpenTeaserVideo}
          heroImageUrl={heroImageUrl}
          homeTitle={homeTitle}
        />

        {/* Latest curate portfolio work */}
        <FeaturedWork
          projects={dynProjects}
          onSelectProject={(proj, forceVideo) => {
            setSelectedProject(proj);
            setStartWithVideo(!!forceVideo);
            showToast(`Opening gallery for ${proj.coupleNames || proj.title}`);
          }}
        />

        {/* Services & specifications */}
        <Services
          services={dynServices}
          onSelectService={(service) => {
            setSelectedService(service);
            showToast(`Opening details for ${service.title}`);
          }}
        />

        {/* Professional camera and lighting gear details */}
        <Gear items={dynGearItems} />

        {/* Artist Biopic biography */}
        <About meImageUrl={aboutMeImageUrl} collabImageUrl={aboutCollabImageUrl} meImageFit={aboutMeImageFit} />

        {/* Workflow steps */}
        <Process />

        {/* Interactive map coordinates booking form */}
        <Contact initialFormState={bookingPrefill} onNewBooking={handleNewBooking} />

        {/* Branding footer */}
        <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      </div>

      {/* 2. SPECIFICATION DETAILS MODAL OVERLAY */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-2xl border-3 border-neutral-950 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden text-left"
            >
              {/* Escape X trigger */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white border-2 border-neutral-950 text-neutral-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:bg-yellow-101 hover:translate-y-[-1px] transition-all cursor-pointer z-20"
                title="Exit specs panel"
                id="close-spec-modal"
              >
                <X className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>

              {/* Specification Header */}
              <div className="bg-yellow-300 p-8 border-b-3 border-neutral-950 relative text-neutral-950">
                <span className="text-[10px] uppercase tracking-wider font-mono font-black text-neutral-500">
                  {selectedService.id === "skin-retouching" ? "MAGAZINE RETOUCH" : "CREATIVE WORKPACK"}
                </span>
                <h3 className="font-sans text-3xl font-black mt-1 leading-none">
                  {selectedService.title}
                </h3>
                <div className="inline-block mt-4 bg-white border-2 border-neutral-950 font-mono text-xs font-bold uppercase px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  STANDARD RATE: {selectedService.startingPrice}
                </div>
              </div>

              {/* Specification specifications details */}
              <div className="p-8 space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase font-mono font-black tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-neutral-950" />
                    Focus Parameters
                  </h4>
                  <p className="font-sans text-sm text-neutral-700 leading-relaxed font-semibold">
                    {selectedService.description}
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-6 border-2 border-neutral-950 rounded-2xl relative overflow-hidden">
                  <h4 className="text-[10px] font-mono font-black uppercase text-[#121212] mb-4 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-500" />
                    What is guaranteed
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedService.deliverables.map((item, id) => (
                      <div key={id} className="flex gap-2.5 text-xs text-neutral-800 font-bold font-sans items-center">
                        <span className="h-5 w-5 rounded-md bg-teal-100 border border-neutral-950 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-neutral-950" />
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                    <div className="flex gap-2.5 text-xs text-neutral-850 font-bold font-sans items-center">
                      <span className="h-5 w-5 rounded-md bg-teal-100 border border-neutral-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-neutral-950" />
                      </span>
                      <span>High speed cloud handoff</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-teal-100 border-2 border-neutral-950 rounded-xl text-xs font-sans text-neutral-800 font-bold leading-normal">
                  <Shield className="w-5 h-5 text-neutral-950 shrink-0 mt-0.5" />
                  <p>
                    All editing commissions include direct alignment on color profiles. RAW files are backed up on persistent secure arrays to safeguard your private archives forever.
                  </p>
                </div>
              </div>

              {/* Specs footer button */}
              <div className="bg-[#FAF9F6] p-6 flex flex-col sm:flex-row gap-4 items-center justify-between border-t-2 border-neutral-950">
                <span className="text-xs font-mono font-extrabold text-neutral-500">
                  ⚡ Custom requirements welcome.
                </span>
                
                <button
                  onClick={() => {
                    let eventId = selectedService.id;
                    handleOpenBookingWithPrefill({
                      eventType: eventId,
                      message: `Inquiring about details on the "${selectedService.title}" package.`
                    });
                    setSelectedService(null);
                    showToast(`Prefilled request form with ${selectedService.title}!`);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-yellow-300 text-neutral-950 font-mono text-xs font-black uppercase border-2 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-all"
                >
                  Reserve This Service
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. LIGHTBOX AND CINEMATIC PLAYBACK */}
      {selectedProject && (
        <Lightbox
          project={selectedProject}
          startWithVideo={startWithVideo}
          onClose={() => {
            setSelectedProject(null);
            setStartWithVideo(false);
          }}
        />
      )}

      {/* 4. FLOATING TACTILE TOAST CONTAINER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#121212] text-white border-2 border-neutral-950 py-3 px-6 shadow-[3px_3px_0px_rgba(255,255,255,1)] text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. SECURE ADMIN PANEL */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            services={dynServices}
            onUpdateServices={handleUpdateServices}
            projects={dynProjects}
            onUpdateProjects={handleUpdateProjects}
            testimonials={dynTestimonials}
            onUpdateTestimonials={handleUpdateTestimonials}
            bookings={dynBookings}
            heroImageUrl={heroImageUrl}
            onUpdateHeroImage={handleUpdateHeroImageUrl}
            homeTitle={homeTitle}
            onUpdateHomeTitle={handleUpdateHomeTitle}
            aboutMeImageUrl={aboutMeImageUrl}
            onUpdateAboutMeImage={handleUpdateAboutMeImageUrl}
            aboutCollabImageUrl={aboutCollabImageUrl}
            onUpdateAboutCollabImage={handleUpdateAboutCollabImageUrl}
            aboutMeImageFit={aboutMeImageFit}
            onUpdateAboutMeImageFit={handleUpdateAboutMeImageFit}
            gearItems={dynGearItems}
            onUpdateGearItems={handleUpdateGearItems}
            cloudinaryCloudName={cloudinaryCloudName}
            cloudinaryUploadPreset={cloudinaryUploadPreset}
            onUpdateCloudinary={handleUpdateCloudinary}
            onForceCloudSync={handleSyncLocalToCloud}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
