import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Lock, Key, Settings, Image as ImageIcon, Briefcase, 
  Sparkles, Award, Sliders, Eye, Plus, Trash2, Edit3, 
  Check, AlertCircle, RefreshCw, Layers, Clipboard, Mail, HelpCircle, User,
  Camera, ExternalLink
} from "lucide-react";
import { auth, googleProvider } from "../lib/firebase";
import firebaseConfig from "../../firebase-applet-config.json";
import { signInWithPopup, signOut } from "firebase/auth";
import { Project, Service, Testimonial, BookingSubmission, GearItem } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  testimonials: Testimonial[];
  onUpdateTestimonials: (testimonials: Testimonial[]) => void;
  bookings: BookingSubmission[];
  heroImageUrl: string;
  onUpdateHeroImage: (url: string) => void;
  homeTitle: string;
  onUpdateHomeTitle: (title: string) => void;
  aboutMeImageUrl: string;
  onUpdateAboutMeImage: (url: string) => void;
  aboutCollabImageUrl: string;
  onUpdateAboutCollabImage: (url: string) => void;
  aboutMeImageFit: string;
  onUpdateAboutMeImageFit: (fit: string) => void;
  gearItems: GearItem[];
  onUpdateGearItems: (gearItems: GearItem[]) => void;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
  onUpdateCloudinary: (name: string, preset: string) => void;
  onForceCloudSync?: () => Promise<boolean>;
}

/**
 * Compresses an image file in the browser before upload to keep high quality but reduce size.
 * Resizes if it exceeds maxWidth/maxHeight while preserving aspect ratio.
 */
const compressImage = (file: File, maxWidth = 2560, maxHeight = 2560, quality = 0.88): Promise<File> => {
  return new Promise((resolve) => {
    if (!file.type || !file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const isPng = file.type === "image/png";
        const outputMime = isPng ? "image/png" : "image/jpeg";

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const fileName = isPng ? file.name : file.name.replace(/\.[^/.]+$/, "") + ".jpg";
              const compressedFile = new File([blob], fileName, {
                type: outputMime,
                lastModified: Date.now(),
              });
              
              if (compressedFile.size < file.size) {
                console.log(`[Auto-Compress] Original size: ${(file.size / 1024 / 1024).toFixed(2)}MB, New size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            } else {
              resolve(file);
            }
          },
          outputMime,
          isPng ? undefined : quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

export default function AdminPanel({
  isOpen,
  onClose,
  services,
  onUpdateServices,
  projects,
  onUpdateProjects,
  testimonials,
  onUpdateTestimonials,
  bookings,
  heroImageUrl,
  onUpdateHeroImage,
  homeTitle,
  onUpdateHomeTitle,
  aboutMeImageUrl,
  onUpdateAboutMeImage,
  aboutCollabImageUrl,
  onUpdateAboutCollabImage,
  aboutMeImageFit,
  onUpdateAboutMeImageFit,
  gearItems,
  onUpdateGearItems,
  cloudinaryCloudName,
  cloudinaryUploadPreset,
  onUpdateCloudinary,
  onForceCloudSync
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [isSyncingToCloud, setIsSyncingToCloud] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState("");
  const [googleAuthError, setGoogleAuthError] = useState("");
  const [showDomainStepGuide, setShowDomainStepGuide] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    setIsIframe(typeof window !== "undefined" && window.self !== window.top);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      if (user && user.email === "shadmanalif486@gmail.com") {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setGoogleAuthError("");
    setShowDomainStepGuide(false);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user && result.user.email === "shadmanalif486@gmail.com") {
        setIsAuthenticated(true);
        setGoogleAuthError("");
        setAuthError("");
      } else {
        const errorMsg = "অনুমতি নেই! দয়া করে সঠিক অ্যাডমিন জিমেইল অ্যাকাউন্ট (shadmanalif486@gmail.com) দিয়ে লগইন করুন।";
        setGoogleAuthError(errorMsg);
        setAuthError(errorMsg);
        await signOut(auth);
      }
    } catch (err: any) {
      console.error("Google Auth error info:", err);
      let errorMsg = err.message || String(err);
      
      if (err.code === "auth/unauthorized-domain") {
        errorMsg = `এই ডোমেনটি (${window.location.hostname}) আপনার Firebase প্রোজেক্টে অনুমোদিত (Authorized Domain) নয়। ডেটা সিঙ্ক করার জন্য এটিকে ফায়ারবেস কনসোলে প্রোভাইডার ডোমেন হিসেবে যুক্ত করতে হবে।`;
        setShowDomainStepGuide(true);
      } else if (err.code === "auth/popup-blocked") {
        errorMsg = "আপনার ব্রাউজার গুগল অথ পপ-আপ উইন্ডো বা উইজেটটি ব্লক করেছে। দয়া করে আপনার ব্রাউজার সেটিংস থেকে পপ-আপ চালু (Allow pop-ups) করে পুনরায় চেষ্টা করুন!";
      } else if (err.code === "auth/popup-closed-by-user") {
        errorMsg = "লগইন স্ক্রিন পপআপটি আপনি বন্ধ করেছেন। পুনরায় সাইন-ইন ট্রাই করুন।";
      } else if (err.code === "auth/network-request-failed") {
        errorMsg = "নেটওয়ার্ক কানেকশন ব্যর্থ হয়েছে। দয়া করে আপনার ইন্টারনেট কানেকশন বা ফায়ারওয়াল চেক করুন!";
      } else if (err.code === "auth/internal-error") {
        errorMsg = `অভ্যন্তরীণ ফায়ারবেস অথেন্টিকেশন সমস্যা: ${err.message}`;
      }
      
      setGoogleAuthError(errorMsg);
      setAuthError(errorMsg);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setFirebaseUser(null);
    } catch (err: any) {
      console.error("Sign out error", err);
    }
  };
  const [activeTab, setActiveTab] = useState<"general" | "cloudinary" | "projects" | "services" | "testimonials" | "bookings" | "gear">("general");

  // Cloudinary State (Stored locally in localStorage)
  const [cloudName, setCloudName] = useState(() => {
    return localStorage.getItem("cloudinary_cloud_name") || "db3uewokh";
  });
  const [uploadPreset, setUploadPreset] = useState(() => {
    const saved = localStorage.getItem("cloudinary_upload_preset");
    if (saved === "ml_default") {
      localStorage.setItem("cloudinary_upload_preset", "wedding_preset");
      return "wedding_preset";
    }
    return saved || "wedding_preset";
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Manage States
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Home edit state
  const [tempTitle, setTempTitle] = useState(homeTitle);
  const [tempHeroImage, setTempHeroImage] = useState(heroImageUrl);
  const [tempAboutMeImage, setTempAboutMeImage] = useState(aboutMeImageUrl);
  const [tempAboutCollabImage, setTempAboutCollabImage] = useState(aboutCollabImageUrl);
  const [tempAboutMeImageFit, setTempAboutMeImageFit] = useState(aboutMeImageFit);
  const [generalUploadLoading, setGeneralUploadLoading] = useState(false);
  const [aboutMeUploadLoading, setAboutMeUploadLoading] = useState(false);
  const [aboutCollabUploadLoading, setAboutCollabUploadLoading] = useState(false);
  const [projectCoverUploadLoading, setProjectCoverUploadLoading] = useState(false);
  const [projectGalleryUploadLoading, setProjectGalleryUploadLoading] = useState(false);
  const [testimonialUploadLoading, setTestimonialUploadLoading] = useState(false);

  // Edit forms
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    coupleNames: "",
    location: "",
    year: "2026",
    category: "photography",
    mainImage: "",
    tagline: "",
    galleryImages: []
  });
  const [newGalleryInput, setNewGalleryInput] = useState("");

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({
    title: "",
    subtitle: "",
    description: "",
    startingPrice: "",
    deliverables: [],
    iconName: "Camera"
  });
  const [newDeliverableInput, setNewDeliverableInput] = useState("");

  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    author: "",
    role: "Bride & Groom",
    text: "",
    rating: 5,
    image: "",
    location: "Mymensingh Ceremony",
    eventDate: "2026"
  });

  // Gear states and helper functions
  const [editingGearId, setEditingGearId] = useState<string | null>(null);
  const [newGear, setNewGear] = useState<Partial<GearItem>>({
    name: "",
    category: "bodies",
    categoryLabel: "Camera Body",
    specs: "",
    description: "",
    tag: "",
    tagColor: "bg-red-400"
  });

  const handleAddOrUpdateGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGear.name) {
      alert("দয়া করে গিয়ারের নাম দিন!");
      return;
    }

    const categoryLabels = {
      bodies: "Camera Body",
      lenses: "Prime Lens",
      lighting: "Continuous / Flash Light",
      modifiers: "Softbox / Light Modifier",
      workstations: "Editing Workstation"
    };

    const gearToAdd: GearItem = {
      id: editingGearId || `gear-${Date.now()}`,
      name: newGear.name || "Unnamed Gear",
      category: (newGear.category as any) || "bodies",
      categoryLabel: categoryLabels[newGear.category as keyof typeof categoryLabels] || "Camera Gear",
      specs: newGear.specs || "Standard Spec",
      description: newGear.description || "",
      tag: newGear.tag || "Calibrated & Studio Verified",
      tagColor: newGear.tagColor || "bg-yellow-400"
    };

    if (editingGearId) {
      onUpdateGearItems(gearItems.map(g => g.id === editingGearId ? gearToAdd : g));
      setEditingGearId(null);
    } else {
      onUpdateGearItems([...gearItems, gearToAdd]);
    }

    setNewGear({
      name: "",
      category: "bodies",
      categoryLabel: "Camera Body",
      specs: "",
      description: "",
      tag: "",
      tagColor: "bg-red-400"
    });
  };

  const handleEditGearClick = (g: GearItem) => {
    setEditingGearId(g.id);
    setNewGear(g);
  };

  const handleDeleteGear = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই গিয়ারটি তালিকা থেকে বাদ দিতে চান?")) {
      onUpdateGearItems(gearItems.filter(g => g.id !== id));
    }
  };

  // Sync temp values when props change or auth succeeds, but prevent wiping local inputs during other updates
  useEffect(() => {
    if (isOpen) {
      setTempTitle(homeTitle);
      setTempHeroImage(heroImageUrl);
      setTempAboutMeImage(aboutMeImageUrl);
      setTempAboutCollabImage(aboutCollabImageUrl);
      setTempAboutMeImageFit(aboutMeImageFit);
    }
  }, [isOpen, isAuthenticated, homeTitle, heroImageUrl, aboutMeImageUrl, aboutCollabImageUrl, aboutMeImageFit]);

  useEffect(() => {
    if (cloudinaryCloudName) {
      setCloudName(cloudinaryCloudName);
    }
    if (cloudinaryUploadPreset) {
      setUploadPreset(cloudinaryUploadPreset);
    }
  }, [cloudinaryCloudName, cloudinaryUploadPreset]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "Dead9080@") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।");
    }
  };

  const handleSaveCloudinarySettings = () => {
    onUpdateCloudinary(cloudName.trim(), uploadPreset.trim());
    alert("Cloudinary কনফিগারেশন সফলভাবে ক্লাউড ডেটাবেসে সিঙ্ক করা হয়েছে!");
  };

  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!cloudName || !uploadPreset) {
      setUploadError("দয়া করে আগে Cloudinary Cloud Name এবং Upload Preset সেটিংস সেট করুন!");
      return;
    }

    setUploadLoading(true);
    setUploadError("");
    setUploadedImageUrl("");

    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const details = errData.error?.message || "";
        throw new Error(`আপলোড ব্যর্থ হয়েছে! ${details ? `(${details}) ` : ""}ক্লাউডিং ডিটেইলস এবং Unsigned Preset চেক করুন।`);
      }

      const data = await res.json();
      if (data.secure_url) {
        setUploadedImageUrl(data.secure_url);
      } else {
        throw new Error("সরাসরি সেকিউর ইউআরএল পাওয়া যায়নি।");
      }
    } catch (err: any) {
      setUploadError(err.message || "ছবি আপলোড করার সময় কোনো সমস্যা হয়েছে।");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveGeneral = () => {
    onUpdateHomeTitle(tempTitle);
    onUpdateHeroImage(tempHeroImage);
    onUpdateAboutMeImage(tempAboutMeImage);
    onUpdateAboutCollabImage(tempAboutCollabImage);
    onUpdateAboutMeImageFit(tempAboutMeImageFit);
    alert("সাধারণ সেটিংস ও হোম পেজ কন্টেন্ট সফলভাবে সেভ হয়েছে!");
  };

  // ----- PROJECTS HANDLERS -----
  const handleAddProject = () => {
    if (!newProject.title || !newProject.mainImage) {
      alert("দয়া করে কাজের টাইটেল এবং মূল কাভার ইমেজ ইউআরএল প্রদান করুন!");
      return;
    }

    const projectToAdd: Project = {
      id: editingProjectId || `proj-${Date.now()}`,
      title: newProject.title || "",
      coupleNames: newProject.coupleNames || "",
      location: newProject.location || "Mymensingh",
      year: newProject.year || "2026",
      category: (newProject.category as any) || "photography",
      mainImage: newProject.mainImage || "",
      tagline: newProject.tagline || "",
      galleryImages: newProject.galleryImages || []
    };

    if (editingProjectId) {
      onUpdateProjects(projects.map(p => p.id === editingProjectId ? projectToAdd : p));
      setEditingProjectId(null);
    } else {
      onUpdateProjects([...projects, projectToAdd]);
    }

    // Reset Form
    setNewProject({
      title: "",
      coupleNames: "",
      location: "",
      year: "2026",
      category: "photography",
      mainImage: "",
      tagline: "",
      galleryImages: []
    });
    setNewGalleryInput("");
  };

  const handleEditProjectClick = (proj: Project) => {
    setEditingProjectId(proj.id);
    setNewProject(proj);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই প্রজেক্টটি ডিলিট করতে চান?")) {
      onUpdateProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryInput.trim()) return;
    setNewProject(prev => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), newGalleryInput.trim()]
    }));
    setNewGalleryInput("");
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setNewProject(prev => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== idx)
    }));
  };

  // ----- SERVICES HANDLERS -----
  const handleSaveService = () => {
    if (!newService.title || !newService.startingPrice) {
      alert("দয়া করে সার্ভিসের টাইটেল এবং স্টার্টিং প্রাইস প্রদান করুন!");
      return;
    }

    const serviceToAdd: Service = {
      id: editingServiceId || `service-${Date.now()}`,
      title: newService.title || "",
      subtitle: newService.subtitle || "",
      description: newService.description || "",
      iconName: newService.iconName || "Camera",
      deliverables: newService.deliverables || [],
      startingPrice: newService.startingPrice || ""
    };

    if (editingServiceId) {
      onUpdateServices(services.map(s => s.id === editingServiceId ? serviceToAdd : s));
      setEditingServiceId(null);
    } else {
      onUpdateServices([...services, serviceToAdd]);
    }

    setNewService({
      title: "",
      subtitle: "",
      description: "",
      startingPrice: "",
      deliverables: [],
      iconName: "Camera"
    });
    setNewDeliverableInput("");
  };

  const handleEditServiceClick = (serv: Service) => {
    setEditingServiceId(serv.id);
    setNewService(serv);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই সার্ভিসটি ডিলিট করতে চান?")) {
      onUpdateServices(services.filter(s => s.id !== id));
    }
  };

  const handleAddDeliverable = () => {
    if (!newDeliverableInput.trim()) return;
    setNewService(prev => ({
      ...prev,
      deliverables: [...(prev.deliverables || []), newDeliverableInput.trim()]
    }));
    setNewDeliverableInput("");
  };

  const handleRemoveDeliverable = (idx: number) => {
    setNewService(prev => ({
      ...prev,
      deliverables: (prev.deliverables || []).filter((_, i) => i !== idx)
    }));
  };

  // ----- TESTIMONIALS HANDLERS -----
  const handleSaveTestimonial = () => {
    if (!newTestimonial.author || !newTestimonial.text) {
      alert("দয়া করে নাম এবং বক্তব্যটি খালি রাখবেন না!");
      return;
    }

    const testToAdd: Testimonial = {
      id: editingTestimonialId || `test-${Date.now()}`,
      author: newTestimonial.author || "",
      role: newTestimonial.role || "Bride & Groom",
      text: newTestimonial.text || "",
      rating: newTestimonial.rating || 5,
      image: newTestimonial.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      location: newTestimonial.location || "Mymensingh",
      eventDate: newTestimonial.eventDate || "2026"
    };

    if (editingTestimonialId) {
      onUpdateTestimonials(testimonials.map(t => t.id === editingTestimonialId ? testToAdd : t));
      setEditingTestimonialId(null);
    } else {
      onUpdateTestimonials([...testimonials, testToAdd]);
    }

    setNewTestimonial({
      author: "",
      role: "Bride & Groom",
      text: "",
      rating: 5,
      image: "",
      location: "Mymensingh Ceremony",
      eventDate: "2026"
    });
  };

  const handleEditTestimonialClick = (t: Testimonial) => {
    setEditingTestimonialId(t.id);
    setNewTestimonial(t);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই রিভিউটি ডিলিট করতে চান?")) {
      onUpdateTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 text-left overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white w-full max-w-5xl border-3 border-neutral-950 shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header matching neo-brutalist mockup */}
        <div className="bg-yellow-300 p-5 sm:p-6 border-b-3 border-neutral-950 flex justify-between items-center text-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-neutral-950 flex items-center justify-center shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
              <Lock className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-wide">
                Shadman Alif Studio Admin
              </h2>
              <p className="text-[10px] font-mono uppercase font-bold text-neutral-600">
                Dynamic Configuration & Cloudinary File Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border-2 border-neutral-950 text-neutral-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:bg-red-400 hover:translate-y-[-1px] transition-all cursor-pointer"
            title="প্যানেল বন্ধ করুন"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 1. AUTHENTICATION SHIELD */}
        {!isAuthenticated ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 my-auto max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-yellow-250 border-3 border-neutral-950 flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)] animate-bounce">
              <Key className="w-8 h-8 text-neutral-950" />
            </div>
            <div className="space-y-2">
              <h3 className="font-sans text-xl font-bold text-neutral-900">
                অ্যাডমিন সাইন-ইন ভেরিফিকেশন
              </h3>
              <p className="font-sans text-xs text-neutral-500 font-bold">
                সাইটের সার্ভিস, ছবির পোর্টফোলিও, ক্লাউডিনারি সেটিংস এবং বুকিংগুলো পরিচালনা করতে পাসওয়ার্ড দিয়ে প্রবেশ করুন।
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="font-mono text-[10px] uppercase font-bold text-neutral-400">
                  Enter Admin PIN Code
                </label>
                <input
                  type="password"
                  placeholder="পিন কোডটি লিখুন..."
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full p-3.5 bg-[#FAF9F6] border-2.5 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-xl font-mono text-sm tracking-widest text-[#121212] focus:outline-none focus:bg-yellow-50"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex gap-2 p-3 bg-red-100 border-2 border-red-400 text-red-900 font-sans text-xs font-bold rounded-xl items-center text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-yellow-300 text-neutral-950 font-mono text-xs font-black uppercase border-2 border-neutral-950 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer transition-all active:translate-x-[1px]"
              >
                প্যানেলে প্রবেশ করুন
              </button>
            </form>

            {isIframe && (
              <div className="mt-4 p-4 text-left font-sans text-xs text-neutral-900 bg-blue-50 border-2.5 border-neutral-950 shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-2xl w-full">
                <div className="flex gap-2 items-start">
                  <ExternalLink className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <span className="font-extrabold text-blue-800 text-[13px] block">⚠️ ব্রাউজার ফ্রেম (iFrame) সতর্কবার্তা</span>
                    <p className="leading-relaxed text-neutral-700 font-medium text-[11px]">
                      আপনি এই এডিটর বা ওয়ার্কস্পেসের ছোট লাইভ প্রিভিউ ফ্রেমে আছেন। সিকিউরিটি ইন্টিগ্রেশনের কারণে আইফ্রেমের ভেতর গুগল অথেন্টিকেশন পপ-আপ ব্রাউজার ব্লক করতে পারে।
                    </p>
                    <p className="leading-relaxed text-neutral-700 font-bold text-[11px]">
                      সরাসরি গুগল সিঙ্ক করতে ও আনলিমিটেড ছবি নির্বিঘ্নে আপলোড করতে নিচের বাটনে চাপ দিয়ে অ্যাপটি নতুন ট্যাবে ওপেন করুন:
                    </p>
                    <div className="pt-1">
                      <a
                        href={typeof window !== "undefined" ? window.location.href : "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-[10px] font-black uppercase tracking-wider py-2 px-3 rounded-lg border-2 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> নতুন ট্যাবে ওপেন করুন ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 2. MAIN ADMIN BOARD */
          <>
            {/* GOOGLE FIREBASE CLOUD SYNC BANNER */}
            {!firebaseUser ? (
              <div className="bg-orange-50 border-b-2.5 border-neutral-950 px-5 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs text-neutral-900 shadow-sm shrink-0">
                <div className="flex items-start gap-2.5 text-left max-w-4xl">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse border border-neutral-950 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div>
                      <span className="font-bold text-red-600">⚠️ ডাটাবেস অফলাইন মোড (লোকাল সেভ):</span> আপনি PIN দিয়ে প্রবেশ করেছেন কিন্তু গুগল ডাটাবেসে সিঙ্ক অন করেননি। ছবি ও মূল্য আপডেট ক্লাউড ডেটাবেসে পাঠাতে এবং লাইভ পরিবর্তন সবার ফোনে দেখাতে গুগল দিয়ে সাইন-ইন সচল করুন।
                    </div>
                    {isIframe && (
                      <p className="text-[11px] text-neutral-600 font-bold border-l-2 border-orange-300 pl-2">
                        💡 যেহেতু অ্যাপটি ব্রাউজারের আইফ্রেম (iFrame) দিয়ে চলছে, তাই গুগল লগইন করার জন্য পপ-আপ উইন্ডোটি ব্লক হতে পারে। পপ-আপ কাজ না করলে পাশে <strong>"নতুন ট্যাবে ওপেন"</strong> বাটনে ক্লিক করে পুনরায় সাইন-ইন ট্রাই করুন!
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-center">
                  {isIframe && (
                    <a
                      href={typeof window !== "undefined" ? window.location.href : "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-sky-50 hover:bg-sky-100 text-neutral-950 font-mono text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg border-2 border-neutral-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                      নতুন ট্যাবে ওপেন
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg border-2 border-neutral-950 shadow-[1.5px_1.5px_0px_rgba(255,255,255,0.3)] hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    গুগল সিঙ্ক অন করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border-b-2.5 border-neutral-950 px-5 py-2.5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2.5 font-sans text-xs text-neutral-900 shadow-sm">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full border border-neutral-950 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-700">🟢 লাইভ ক্লাউড ডাটাবেস সিঙ্কড:</span> ছবি বা প্রজেক্ট মূল্য আপডেট করার সাথে সাথে তা সরাসরি Cloudinary ও Firestore-এ আপলোড হয়ে যাবে এবং সমস্ত ডিভাইস ও কাস্টমারের কাছে লাইভ শো হবে।
                  </div>
                </div>
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span className="text-[10px] font-mono text-neutral-500">{firebaseUser?.email}</span>
                  <button
                    type="button"
                    onClick={handleGoogleSignOut}
                    className="text-[10px] font-mono font-black text-red-600 uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    লগআউট
                  </button>
                </div>
              </div>
            )}

            {/* GOOGLE AUTH ERROR INFO GRID */}
            {googleAuthError && (
              <div className="bg-red-50 border-b-2.5 border-neutral-950 p-6 text-left font-sans text-xs text-neutral-950 shadow-sm shrink-0">
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-3 flex-1">
                    <div>
                      <strong className="font-extrabold text-red-700">❌ গুগল সাইন-ইন সফল হয়নি!</strong>
                      <p className="mt-1 font-semibold text-neutral-800">{googleAuthError}</p>
                    </div>

                    {showDomainStepGuide && (
                      <div className="bg-white border-2 border-neutral-950 rounded-xl p-5 space-y-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] max-w-3xl">
                        <span className="font-black text-neutral-950 block border-b-2 border-neutral-950 pb-2 text-sm">🛠️ এটি সমাধান করার সহজ নিয়ম (১ মিনিটের কাজ):</span>
                        <ol className="list-decimal list-inside space-y-2.5 font-bold text-neutral-800 leading-relaxed">
                          <li>
                            এই লিংকে ক্লিক করে আপনার ফায়ারবেস কনসোলে যান:{" "}
                            <a 
                              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-blue-600 underline font-black hover:text-blue-800"
                            >
                              Firebase Console [ভেরিফাইড লিংক] ↗
                            </a>
                          </li>
                          <li>সেখান থেকে উপরে ডানপাশে <strong className="text-neutral-950 underline">Settings (সেটিংস)</strong> ট্যাবে ক্লিক করুন।</li>
                          <li>বাম পাশের তালিকা থেকে <strong className="text-neutral-950 underline">Authorized domains (অনুমোদিত ডোমেনসমূহ)</strong> অপশনে ক্লিক করুন।</li>
                          <li><strong className="text-neutral-950">Add domain (ডোমেন যোগ করুন)</strong> বাটনে ক্লিক করে হুবহু নিচের ডোমেনটি টাইপ বা পেস্ট করুন:</li>
                          <div className="my-1.5 p-3.5 bg-yellow-101 border-2 border-neutral-950 rounded-lg text-neutral-950 font-mono text-xs select-all text-center flex items-center justify-between gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                            <span className="font-black select-all">{window.location.hostname}</span>
                            <span className="bg-neutral-950 text-white text-[9px] px-2 py-0.5 rounded uppercase font-sans">কпи করুন</span>
                          </div>
                          <li>ডোমেন যুক্ত করে <strong className="text-neutral-950">Save (সংরক্ষণ)</strong>-এ চাপুন। এবার এই পেজে এসে আবার লগইন বাটনে প্রেস করুন। সাথে সাথে কানেক্ট হয়ে যাবে!</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Admin Sidebar Navigation */}
            <div className="border-b-2 md:border-b-0 md:border-r-3 border-neutral-950 bg-[#FAF9F6] w-full md:w-56 flex flex-row md:flex-col overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex-1 md:flex-none flex items-center md:items-start gap-2.5 p-3 sm:p-4 text-xs font-mono font-bold capitalize border-b md:border-b border-neutral-901/10 text-left transition-colors whitespace-nowrap ${
                  activeTab === "general" ? "bg-yellow-101 border-r-0 md:border-r-3 md:border-r-neutral-950 text-neutral-950 font-black" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <User className="w-4 h-4" />
                <span>সাধারণ ও হোম কন্টেন্ট</span>
              </button>

              <button
                onClick={() => setActiveTab("cloudinary")}
                className={`flex-1 md:flex-none flex items-center md:items-start gap-2.5 p-3 sm:p-4 text-xs font-mono font-bold capitalize border-b md:border-b border-neutral-901/10 text-left transition-colors whitespace-nowrap ${
                  activeTab === "cloudinary" ? "bg-[#e0f2fe] border-r-0 md:border-r-3 md:border-r-sky-500 text-neutral-950 font-black" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <ImageIcon className="w-4 h-4 text-sky-500" />
                <span>Cloudinary ও আপলোডার</span>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`flex-1 md:flex-none flex items-center md:items-start gap-2.5 p-3 sm:p-4 text-xs font-mono font-bold capitalize border-b md:border-b border-neutral-901/10 text-left transition-colors whitespace-nowrap ${
                  activeTab === "projects" ? "bg-[#fef3c7] border-r-0 md:border-r-3 md:border-r-amber-500 text-neutral-950 font-black" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span>পোর্টফোলিও (Projects)</span>
              </button>

              <button
                onClick={() => setActiveTab("services")}
                className={`flex-1 md:flex-none flex items-center md:items-start gap-2.5 p-3 sm:p-4 text-xs font-mono font-bold capitalize border-b md:border-b border-neutral-901/10 text-left transition-colors whitespace-nowrap ${
                  activeTab === "services" ? "bg-[#ccfbf1] border-r-0 md:border-r-3 md:border-r-teal-500 text-neutral-950 font-black" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Sliders className="w-4 h-4 text-teal-500" />
                <span>সার্ভিসেস ও প্রজেক্ট রেট</span>
              </button>

              <button
                onClick={() => setActiveTab("testimonials")}
                className={`flex-1 md:flex-none flex items-center md:items-start gap-2.5 p-3 sm:p-4 text-xs font-mono font-bold capitalize border-b md:border-b border-neutral-901/10 text-left transition-colors whitespace-nowrap ${
                  activeTab === "testimonials" ? "bg-[#fce7f3] border-r-0 md:border-r-3 md:border-r-pink-500 text-neutral-950 font-black" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Award className="w-4 h-4 text-pink-500" />
                <span>গ্রাহকদের টেস্টিমোনিয়াল</span>
              </button>

              <button
                onClick={() => setActiveTab("gear")}
                className={`flex-1 md:flex-none flex items-center md:items-start gap-2.5 p-3 sm:p-4 text-xs font-mono font-bold capitalize border-b md:border-b border-neutral-901/10 text-left transition-colors whitespace-nowrap ${
                  activeTab === "gear" ? "bg-[#fef3c7] border-r-0 md:border-r-3 md:border-r-yellow-500 text-neutral-950 font-black" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Camera className="w-4 h-4 text-yellow-500" />
                <span>আমার প্রিমিয়াম গিয়ার (My Gear)</span>
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 md:flex-none flex items-center md:items-start justify-between p-3 sm:p-4 text-xs font-mono font-bold capitalize text-left transition-colors whitespace-nowrap ${
                  activeTab === "bookings" ? "bg-red-50 border-r-0 md:border-r-3 md:border-r-red-400 text-neutral-950 font-black" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>গ্রাহকের বুকিং ইনকোয়ারি</span>
                </span>
                <span className="hidden md:inline px-2 py-0.5 bg-red-420 text-neutral-950 text-[10px] font-black border border-neutral-950 rounded-full bg-red-300">
                  {bookings.length}
                </span>
              </button>
            </div>

            {/* TAB PANELS AREA */}
            <div className="flex-1 p-5 sm:p-8 overflow-y-auto max-h-[calc(92vh-150px)]">
              
              {/* TAB 1: GENERAL WEBSITE TEXTS & PERSONAL PHOTO */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  {/* CLOUD DATABASE SYNC HUB */}
                  <div className="bg-yellow-50 border-3 border-neutral-950 p-6 rounded-2xl text-left shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-neutral-950 pb-4 mb-4">
                      <div>
                        <h4 className="font-sans text-base font-black text-neutral-900 flex items-center gap-2">
                          <RefreshCw className={`w-5 h-5 text-neutral-950 ${isSyncingToCloud ? 'animate-spin' : ''}`} />
                          ব্রাউজার লোকাল ডাটা ক্লাউডে সিঙ্ক করুন
                        </h4>
                        <p className="font-sans text-[11px] text-neutral-500 font-bold mt-1">
                          আপনার এই ডিভাইসে যে সকল ছবি, মূল্য বা প্যাকেজ পরিবর্তন করেছেন, তা সরাসরি গুগল ক্লাউড ডাটাবেসে সেভ করুন।
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-widest border-2 border-neutral-950 rounded-lg ${firebaseUser ? 'bg-emerald-300' : 'bg-amber-300'}`}>
                        {firebaseUser ? '🟢 ক্লাউড অনলাইন' : '🔴 অফলাইন মোড'}
                      </span>
                    </div>

                    {!firebaseUser ? (
                      <div className="space-y-3.5">
                        <div className="bg-amber-100/60 border-2 border-neutral-950 rounded-xl p-4 text-xs font-sans text-neutral-800 font-bold leading-relaxed flex gap-2.5 items-start">
                          <AlertCircle className="w-5 h-5 text-neutral-950 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-red-600 block mb-1">⚠️ ডাটা এখনো ক্লাউডে সংরক্ষণ হয়নি:</span> 
                            আপনি পিন দিয়ে লগড-ইন আছেন, কিন্তু গুগল একাউন্ট যুক্ত করেননি। আপনার করা কোনো পরিবর্তন (যেমন নতুন ছবি বা দাম) অন্য ডিভাইস বা কাস্টমারের ফোনে দেখাতে নিচে গুগল দিয়ে সাইন-ইন করে সিঙ্ক চালু করুন।
                          </div>
                        </div>

                        {googleAuthError && (
                          <div className="bg-red-100/60 border-2 border-neutral-950 rounded-xl p-4 font-sans text-xs text-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                            <div className="flex gap-2.5 items-start">
                              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                              <div className="space-y-2.5">
                                <div>
                                  <strong className="text-red-700">গুগল সাইন-ইন ত্রুটি:</strong>
                                  <p className="mt-1 font-bold text-neutral-800">{googleAuthError}</p>
                                </div>
                                {showDomainStepGuide && (
                                  <div className="bg-white border text-left p-3.5 rounded-lg space-y-2 border-neutral-300">
                                    <span className="font-extrabold text-neutral-950 block">🛠️ ১ মিনিটে সমাধান করার নিয়ম:</span>
                                    <ol className="list-decimal list-inside space-y-1.5 font-bold text-neutral-700">
                                      <li>
                                        যান:{" "}
                                        <a 
                                          href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`} 
                                          target="_blank" 
                                          rel="noreferrer" 
                                          className="text-blue-600 underline font-black"
                                        >
                                          Firebase Settings Console ↗
                                        </a>
                                      </li>
                                      <li><strong className="text-neutral-900">Settings (সেটিংস)</strong> ট্যাবে যান।</li>
                                      <li>বাম পাশের তালিকায় <strong className="text-neutral-900">Authorized domains</strong> সিলেক্ট করুন।</li>
                                      <li><strong className="text-neutral-900">Add domain</strong> বাটনে ক্লিক করে হুবহু নিচে দেওয়া ডোমেনটি বসান:</li>
                                      <code className="block mt-1 p-2 bg-yellow-101 border border-solid border-neutral-900 font-mono text-center select-all bg-yellow-50">{window.location.hostname}</code>
                                      <li>Save-এ ক্লিক করুন। এবার নিচের লগইন বাটনে প্রেস করুন। কাজ হয়ে গেছে!</li>
                                    </ol>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs font-black uppercase tracking-wider py-3 px-5 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_rgba(0,0,0,0.35)] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4 shrink-0 text-white fill-current" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                          גুগল দিয়ে লগইন করে সিঙ্ক অন করুন (shadmanalif486@gmail.com)
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="bg-white border-2 border-neutral-950 p-3 rounded-xl text-center">
                            <span className="block text-[10px] uppercase font-mono font-black text-neutral-400">Services</span>
                            <span className="block text-lg font-mono font-black text-neutral-900 mt-1">{services.length}</span>
                          </div>
                          <div className="bg-white border-2 border-neutral-950 p-3 rounded-xl text-center">
                            <span className="block text-[10px] uppercase font-mono font-black text-neutral-400">Projects</span>
                            <span className="block text-lg font-mono font-black text-neutral-900 mt-1">{projects.length}</span>
                          </div>
                          <div className="bg-white border-2 border-neutral-950 p-3 rounded-xl text-center">
                            <span className="block text-[10px] uppercase font-mono font-black text-neutral-400">Gear Items</span>
                            <span className="block text-lg font-mono font-black text-neutral-900 mt-1">{gearItems.length}</span>
                          </div>
                          <div className="bg-white border-2 border-neutral-950 p-3 rounded-xl text-center">
                            <span className="block text-[10px] uppercase font-mono font-black text-neutral-400">Testimonials</span>
                            <span className="block text-lg font-mono font-black text-neutral-900 mt-1">{testimonials.length}</span>
                          </div>
                        </div>

                        {syncSuccessMessage && (
                          <div className="bg-emerald-100 border-2 border-neutral-950 rounded-xl p-3 text-xs font-sans text-emerald-800 font-bold flex items-center gap-2 animate-bounce">
                            <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                            <span>{syncSuccessMessage}</span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="button"
                            disabled={isSyncingToCloud}
                            onClick={async () => {
                              if (!onForceCloudSync) {
                                alert("সিঙ্ক ফাংশন পাওয়া যায়নি!");
                                return;
                              }
                              setIsSyncingToCloud(true);
                              setSyncSuccessMessage("");
                              try {
                                const success = await onForceCloudSync();
                                if (success) {
                                  setSyncSuccessMessage("🎉 অভিনন্দন! লোকাল ব্রাউজারের সকল পরিবর্তিত প্রাইস, ফটো এবং ডেটা সরাসরি গুগল ক্লাউড ডাটাবেসে সিঙ্ক হয়ে গেছে!");
                                  setTimeout(() => setSyncSuccessMessage(""), 7000);
                                } else {
                                  alert("দুঃখিত, আপলোড সংযোগ ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন!");
                                }
                              } catch (err: any) {
                                console.error("Sync error", err);
                                let message = "দুঃখিত, আপলোড সংযোগ ব্যর্থ হয়েছে।";
                                if (err instanceof Error) {
                                  const errStr = err.message;
                                  try {
                                    // Parse FirestoreErrorInfo if formatted as JSON
                                    const parsed = JSON.parse(errStr);
                                    if (parsed.error) {
                                      if (parsed.error.includes("permission") || parsed.error.includes("Permission") || parsed.error.includes("insufficient")) {
                                        message += "\n\nভুল এডমিন পারমিশন অথবা ডাটাবেস সিকিউরিটি পলিসি ব্লক করেছে। (Permission Denied)\n\nনিশ্চিত করুন যে আপনি সঠিক এডমিন জিমেইল ('shadmanalif486@gmail.com') দিয়ে গুগল সিঙ্ক সচল করেছেন।";
                                      } else {
                                        message += `\n\nকারণ: ${parsed.error}`;
                                      }
                                    } else {
                                      message += `\n\nকারণ: ${errStr}`;
                                    }
                                  } catch (parseEx) {
                                    if (errStr.includes("permission") || errStr.includes("Permission") || errStr.includes("insufficient")) {
                                      message += "\n\nভুল এডমিন পারমিশন অথবা ডাটাবেস সিকিউরিটি পলিসি ব্লক করেছে। (Permission Denied)\n\nনিশ্চিত করুন যে আপনি সঠিক এডমিন জিমেইল ('shadmanalif486@gmail.com') দিয়ে গুগল সিঙ্ক সচল করেছেন।";
                                    } else if (errStr.includes("quota") || errStr.includes("Quota")) {
                                      message += "\n\nডাটাবেস লিমিট/কোটা অতিক্রম করেছে। অনুগ্রহ করে আগামীকাল পুনরায় চেষ্টা করুন।";
                                    } else {
                                      message += `\n\nকারণ: ${errStr}`;
                                    }
                                  }
                                }
                                alert(message);
                              } finally {
                                setIsSyncingToCloud(false);
                              }
                            }}
                            className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-600 text-[#FAF9F6] font-mono text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-xl border-2 border-neutral-950 shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4.5px_4.5px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-all flex items-center justify-center gap-2"
                          >
                            {isSyncingToCloud ? (
                              <>
                                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                                <span>গুগল ক্লাউড ডাটাবেসে ডাটা পাঠানো হচ্ছে...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4" />
                                <span>🔄 গুগল ডেটাবেসে সব লোকাল ডাটা সিঙ্ক করুন (Push to Live Cloud)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-sans text-lg font-black text-neutral-900 border-b-2 border-neutral-950 pb-2 flex items-center gap-2">
                      <User className="w-5 h-5 text-neutral-950" />
                      হোম পেজ তথ্য এবং প্রোফাইল ছবি
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-medium mt-1">
                      হোম স্ক্রিনের স্লোগান এবং আপনার নিখুঁত কাভার প্রোফাইল ইমেজ পরিবর্তন করুন।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Home Header Slogan */}
                    <div className="space-y-1.5 text-left">
                      <label className="font-mono text-[10px] uppercase font-black text-neutral-400">
                        Home Banner Headline / Title
                      </label>
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="w-full p-3 bg-[#FAF9F6] border-2 border-neutral-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] rounded-xl font-sans text-sm font-bold text-neutral-900 focus:outline-none"
                      />
                      <p className="text-[10px] text-neutral-400 font-mono">হোম পেজে মূল প্যারাগ্রাফের বোল্ড হেডার স্লোগান (যেমন: Capturing beauty photo)।</p>
                    </div>

                    {/* Profile Picture Image URL Input */}
                    <div className="space-y-1.5 text-left">
                      <label className="font-mono text-[10px] uppercase font-black text-neutral-400">
                        Profile Image URL (Your 2nd Photo)
                      </label>
                      <input
                        type="text"
                        value={tempHeroImage}
                        onChange={(e) => setTempHeroImage(e.target.value)}
                        placeholder="/input_file_1.png বা Cloundinary ইমেজ ইউআরএল..."
                        className="w-full p-3 bg-[#FAF9F6] border-2 border-neutral-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                      />
                      <p className="text-[10px] text-neutral-400 font-mono">আপনার নিজের ছবিতে পরিবর্তন করতে Cloudinary থেকে আপলোড করে পাওয়া লিংকটি এখানে পেস্ট করুন।</p>
                      
                      <div className="pt-1.5 flex flex-col gap-1">
                        <input
                          type="file"
                          id="general-hero-file-input"
                          accept="image/*"
                          className="hidden"
                          disabled={generalUploadLoading}
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (!files || files.length === 0) return;
                            const file = files[0];
                            if (!cloudName || !uploadPreset) {
                              alert("দয়া করে প্রথমে 'Cloudinary ও আপলোডার' ট্যাবে গিয়ে Cloud Name এবং Upload Preset সেট করুন!");
                              return;
                            }
                            setGeneralUploadLoading(true);
                            try {
                              const compressedFile = await compressImage(file);
                              const formData = new FormData();
                              formData.append("file", compressedFile);
                              formData.append("upload_preset", uploadPreset);
                              const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
                                method: "POST",
                                body: formData
                              });
                              if (!res.ok) {
                                const errData = await res.json().catch(() => ({}));
                                const details = errData.error?.message || "";
                                throw new Error(`আপলোড ব্যর্থ হয়েছে! ${details ? `(${details}) ` : ""}Cloudinary ড্যাশবোর্ড সেটিংস চেক করুন।`);
                              }
                              const data = await res.json();
                              if (data.secure_url) {
                                setTempHeroImage(data.secure_url);
                                alert("ছবি সফলভাবে আপলোড হয়েছে! নিচে 'হোম কন্টেন্ট তথ্য সেভ করুন' বাটনে ক্লিক করে সেভ সম্পন্ন করুন।");
                              } else {
                                throw new Error("Secure URL not found in Cloudinary reply.");
                              }
                            } catch (err: any) {
                              alert(err.message || "ছবি আপলোড করার সময় কোনো সমস্যা হয়েছে!");
                            } finally {
                              setGeneralUploadLoading(false);
                            }
                          }}
                        />
                        {generalUploadLoading ? (
                          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-neutral-100 p-2 border border-neutral-300 rounded">
                            <span className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-transparent animate-spin inline-block" />
                            <span>আবহমান ব্যানার ছবি আপলোড হচ্ছে... অনুগ্রহ করে একটু অপেক্ষা করুন...</span>
                          </div>
                        ) : (
                          <label
                            htmlFor="general-hero-file-input"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-neutral-950 font-mono text-[10px] uppercase font-black border-2 border-neutral-950 rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer transition-all hover:translate-y-[-1px] w-fit"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>কম্পিউটার/মোবাইল থেকে সরাসরি নতুন ব্যানার আপলোড করুন</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preview layout */}
                  <div className="bg-[#FAF9F6] p-4 sm:p-6 border-2 border-dashed border-neutral-950 rounded-2xl">
                    <h4 className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 mb-3 block">
                      বর্তমান হোম পেজ ব্যানার প্রিভিউ:
                    </h4>
                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 border border-neutral-950 rounded-xl">
                      <div className="w-24 h-28 border border-neutral-950 rounded-xl overflow-hidden bg-[#FAF9F6] shrink-0">
                        <img 
                          src={tempHeroImage || "/input_file_1.png"} 
                          alt="Cover Profile Preview" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=300";
                          }}
                        />
                      </div>
                      <div className="text-left space-y-2">
                        <p className="text-xs font-mono font-bold bg-yellow-300 px-2 py-1 border border-neutral-950 w-fit text-neutral-950">ESTD. 2020 • MYMENSINGH</p>
                        <h4 className="font-sans text-xl font-black text-neutral-900 leading-none">{tempTitle}</h4>
                        <p className="text-xs text-neutral-500 font-sans font-medium">নিখুঁত মুহূর্তের গল্প ফুটিয়ে তোলা ও ফ্রেমবন্দী করা...</p>
                      </div>
                    </div>
                  </div>

                  {/* About Section Images */}
                  <div className="border-t-2 border-neutral-900/10 pt-6 space-y-4">
                    <div>
                      <h4 className="font-sans text-md font-black text-neutral-900 flex items-center gap-2">
                        <ImageIcon className="w-4.5 h-4.5 text-neutral-950" />
                        অ্যাবাউট মি (About Me) সেকশনের ছবিসমূহ
                      </h4>
                      <p className="font-sans text-xs text-neutral-500 font-medium mt-0.5">
                        আপনার পরিচিতি (About) সেকশনের মূল পোর্ট্রেট এবং ছোট কোলাব ছবি সেট করুন।
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Main About Photo Input */}
                      <div className="space-y-1.5 text-left">
                        <label className="font-mono text-[10px] uppercase font-black text-neutral-400">
                          About Main Portrait Image URL
                        </label>
                        <input
                          type="text"
                          value={tempAboutMeImage}
                          onChange={(e) => setTempAboutMeImage(e.target.value)}
                          placeholder="Cloundinary ইমেজ ইউআরএল বা Unsplash লিংক..."
                          className="w-full p-3 bg-[#FAF9F6] border-2 border-neutral-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                        />
                        
                        <div className="space-y-1 pt-1.5">
                          <label className="font-mono text-[9px] uppercase font-bold text-neutral-400">
                            Portrait Image Fit (ছবির সাইজ/ফিট ধরণ)
                          </label>
                          <select
                            value={tempAboutMeImageFit}
                            onChange={(e) => setTempAboutMeImageFit(e.target.value)}
                            className="w-full p-2 bg-[#FAF9F6] border-2 border-neutral-950 rounded-lg font-mono text-xs text-neutral-950 focus:outline-none"
                          >
                            <option value="cover">Vertical Cover (কোণ কাটা/কাভার ফিট - Face centered)</option>
                            <option value="contain">Contain Full Image (সম্পূর্ণ ছবি - See 100% of photo, no cropping)</option>
                          </select>
                          <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                            ছবিটি যদি আড়াআড়ি (landscape) বা গ্রুপ ছবি হয়, তবে "Contain Full Image" সিলেক্ট করলে আপনার পুরো মুখ স্পষ্ট রেজোলিউশনে সেভ থাকবে।
                          </p>
                        </div>
                        
                        <div className="pt-1.5 flex flex-col gap-1">
                          <input
                            type="file"
                            id="about-me-file-input"
                            accept="image/*"
                            className="hidden"
                            disabled={aboutMeUploadLoading}
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files || files.length === 0) return;
                              const file = files[0];
                              if (!cloudName || !uploadPreset) {
                                alert("দয়া করে প্রথমে 'Cloudinary ও আপলোডার' ট্যাবে গিয়ে Cloud Name এবং Upload Preset সেট করুন!");
                                return;
                              }
                              setAboutMeUploadLoading(true);
                              try {
                                const compressedFile = await compressImage(file);
                                const formData = new FormData();
                                formData.append("file", compressedFile);
                                formData.append("upload_preset", uploadPreset);
                                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
                                  method: "POST",
                                  body: formData
                                });
                                if (!res.ok) {
                                  const errData = await res.json().catch(() => ({}));
                                  const details = errData.error?.message || "";
                                  throw new Error(`আপলোড ব্যর্থ হয়েছে! ${details ? `(${details}) ` : ""}Cloudinary ড্যাশবোর্ড সেটিংস চেক করুন।`);
                                }
                                const data = await res.json();
                                if (data.secure_url) {
                                  setTempAboutMeImage(data.secure_url);
                                  alert("পরিচিতি ছবি সফলভাবে আপলোড হয়েছে! নিচে 'হোম কন্টেন্ট তথ্য সেভ করুন' বাটনে ক্লিক করে সেভ সম্পন্ন করুন।");
                                } else {
                                  throw new Error("Secure URL not found in Cloudinary reply.");
                                }
                              } catch (err: any) {
                                alert(err.message || "ছবি আপলোড করার সময় কোনো সমস্যা হয়েছে!");
                              } finally {
                                setAboutMeUploadLoading(false);
                              }
                            }}
                          />
                          {aboutMeUploadLoading ? (
                            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-neutral-100 p-2 border border-neutral-300 rounded">
                              <span className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-transparent animate-spin inline-block" />
                              <span>পরিচিতি ছবি আপলোড হচ্ছে... অনুগ্রহ করে একটু অপেক্ষা করুন...</span>
                            </div>
                          ) : (
                            <label
                              htmlFor="about-me-file-input"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-neutral-950 font-mono text-[10px] uppercase font-black border-2 border-neutral-950 rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer transition-all hover:translate-y-[-1px] w-fit"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>পরিচিতি মূল ছবি সরাসরি আপলোড করুন</span>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Polaroid Collab Photo Input */}
                      <div className="space-y-1.5 text-left">
                        <label className="font-mono text-[10px] uppercase font-black text-neutral-400">
                          About Polaroid Action Image URL
                        </label>
                        <input
                          type="text"
                          value={tempAboutCollabImage}
                          onChange={(e) => setTempAboutCollabImage(e.target.value)}
                          placeholder="Cloundinary ইমেজ ইউআরএল বা Unsplash লিংক..."
                          className="w-full p-3 bg-[#FAF9F6] border-2 border-neutral-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                        />
                        <p className="text-[10px] text-neutral-400 font-mono">মূল ছবির উপর ওভারল্যাপ করা ছোট পোলাড ছবি (যেমন: ক্যামেরা গিয়ার দৃশ্য)।</p>
                        
                        <div className="pt-1.5 flex flex-col gap-1">
                          <input
                            type="file"
                            id="about-collab-file-input"
                            accept="image/*"
                            className="hidden"
                            disabled={aboutCollabUploadLoading}
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files || files.length === 0) return;
                              const file = files[0];
                              if (!cloudName || !uploadPreset) {
                                alert("দয়া করে প্রথমে 'Cloudinary ও আপলোডার' ট্যাবে গিয়ে Cloud Name এবং Upload Preset সেট করুন!");
                                return;
                              }
                              setAboutCollabUploadLoading(true);
                              try {
                                const compressedFile = await compressImage(file);
                                const formData = new FormData();
                                formData.append("file", compressedFile);
                                formData.append("upload_preset", uploadPreset);
                                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
                                  method: "POST",
                                  body: formData
                                });
                                if (!res.ok) {
                                  const errData = await res.json().catch(() => ({}));
                                  const details = errData.error?.message || "";
                                  throw new Error(`আপলোড ব্যর্থ হয়েছে! ${details ? `(${details}) ` : ""}Cloudinary ড্যাশবোর্ড সেটিংস চেক করুন।`);
                                }
                                const data = await res.json();
                                if (data.secure_url) {
                                  setTempAboutCollabImage(data.secure_url);
                                  alert("কোলাব পোলাড ছবি সফলভাবে আপলোড হয়েছে! নিচে 'হোম কন্টেন্ট তথ্য সেভ করুন' বাটনে ক্লিক করে সেভ সম্পন্ন করুন।");
                                } else {
                                  throw new Error("Secure URL not found in Cloudinary reply.");
                                }
                              } catch (err: any) {
                                alert(err.message || "ছবি আপলোড করার সময় কোনো সমস্যা হয়েছে!");
                              } finally {
                                setAboutCollabUploadLoading(false);
                              }
                            }}
                          />
                          {aboutCollabUploadLoading ? (
                            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-neutral-100 p-2 border border-neutral-300 rounded">
                              <span className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-transparent animate-spin inline-block" />
                              <span>কোলাব ছবি আপলোড হচ্ছে... অনুগ্রহ করে একটু অপেক্ষা করুন...</span>
                            </div>
                          ) : (
                            <label
                              htmlFor="about-collab-file-input"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-neutral-950 font-mono text-[10px] uppercase font-black border-2 border-neutral-950 rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer transition-all hover:translate-y-[-1px] w-fit"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>কোলাব পোলাড ছবি সরাসরি আপলোড করুন</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* About Previews */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 border border-neutral-950 rounded-xl">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-mono uppercase text-neutral-400 mb-1">মূল পোর্ট্রেট প্রিভিউ</span>
                        <div className="w-36 h-48 border border-neutral-950 rounded-xl overflow-hidden bg-neutral-50">
                          <img 
                            src={tempAboutMeImage} 
                            alt="Main About Preview" 
                            className={`w-full h-full rounded pointer-events-none transition-all duration-300 ${
                              tempAboutMeImageFit === "contain" 
                                ? "object-contain bg-neutral-900 p-1" 
                                : "object-cover object-center"
                            }`} 
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-mono uppercase text-neutral-400 mb-1">কোলাব পোলাড প্রিভিউ</span>
                        <div className="w-36 h-48 border border-neutral-950 rounded-xl overflow-hidden bg-neutral-50 flex items-center justify-center p-2">
                          <img src={tempAboutCollabImage} alt="Collab About Preview" className="w-full h-32 object-cover border border-neutral-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveGeneral}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-300 text-neutral-950 font-mono text-xs font-black uppercase border-2 border-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  >
                    <Check className="w-4 h-4" />
                    <span>হোম কন্টেন্ট তথ্য সেভ করুন</span>
                  </button>
                </div>
              )}

              {/* TAB 2: CLOUDINARY FILE UPLOADER & INTEGRATION GUIDE */}
              {activeTab === "cloudinary" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-sans text-lg font-black text-[#121212] border-b-2 border-neutral-950 pb-2 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-sky-500" />
                      Cloudinary ও ছবির আপলোড ম্যানেজার
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-medium mt-1">
                      Cloudinary এর মাধ্যমে আপনি সহজেই যেকোনো ছবি আপলোড করে সেকেন্ডে ছবির নিরাপদ লিংক পেতে পারেন। এই লিংকগুলো আপনার স্লাইডার বা সার্ভিস বা হিরো ছবিতে ব্যবহার করতে পারবেন!
                    </p>
                  </div>

                  {/* Cloudinary Integration settings form */}
                  <div className="bg-[#f0f9ff]/80 border-2 border-neutral-950 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-neutral-950 shadow-[3px_3px_0px_rgba(14,165,233,1)]">
                    <div className="space-y-1 text-left">
                      <label className="font-mono text-[10px] uppercase font-black text-neutral-500">
                        Cloudinary Cloud Name
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: dqrpxxxxx"
                        value={cloudName}
                        onChange={(e) => setCloudName(e.target.value)}
                        className="w-full p-3 bg-white border-2 border-neutral-950 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="font-mono text-[10px] uppercase font-black text-neutral-500">
                        Unsigned Upload Preset
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: wedding_preset"
                        value={uploadPreset}
                        onChange={(e) => setUploadPreset(e.target.value)}
                        className="w-full p-3 bg-white border-2 border-neutral-950 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-between items-center pt-2 gap-4">
                      <p className="text-[10px] font-sans font-medium text-slate-500 max-w-md">
                        * এটি লোকালি ব্রাউজারের `localStorage` এ নিরাপদে সেভ থাকবে, যার ফলে সরাসরি ব্রাউজার থেকেই ছবি ক্লাউডিনারিতে আপলোড হবে।
                      </p>
                      <button
                        onClick={handleSaveCloudinarySettings}
                        className="px-5 py-2.5 bg-neutral-950 text-white font-mono text-2xs font-extrabold uppercase rounded-lg hover:bg-neutral-900 shadow-[1.5px_1.5px_0px_white]"
                      >
                        সেটিংস সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>

                  {/* Direct Uploader Area */}
                  <div className="border-3 border-neutral-950 rounded-2xl overflow-hidden bg-[#FAF9F6] p-6 text-center relative">
                    <h4 className="font-mono text-[10px] uppercase font-bold text-neutral-400 mb-2 block">
                      সরাসরি ক্লাউডিনারি আপলোড জোন (Test Upload Frame)
                    </h4>
                    
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-400 rounded-xl bg-white space-y-4">
                      <input
                        type="file"
                        id="cloudinary-file-picker"
                        accept="image/*"
                        onChange={handleCloudinaryUpload}
                        className="hidden"
                        disabled={uploadLoading}
                      />
                      
                      {uploadLoading ? (
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="w-8 h-8 text-neutral-950 animate-spin" />
                          <p className="font-mono text-xs font-bold text-neutral-950 animate-pulse">
                            ছবি ক্লাউডিনারিতে আপলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
                          </p>
                        </div>
                      ) : (
                        <label 
                          htmlFor="cloudinary-file-picker"
                          className="flex flex-col items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <div className="w-12 h-12 rounded-full bg-teal-50 border border-neutral-950 flex items-center justify-center text-neutral-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="px-4 py-2 bg-yellow-300 border-2 border-neutral-950 font-mono text-2xs font-black uppercase text-neutral-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                              কম্পিউটার/মোবাইল থেকে ছবি সিলেক্ট করুন
                            </span>
                          </div>
                          <p className="text-[10px] font-sans font-semibold text-neutral-400">
                            (যেকোনো JPG, PNG ছবি সিলেক্ট করার সাথে সাথেই আপলোড শুরু হবে)
                          </p>
                        </label>
                      )}

                      {/* Display Upload Errors */}
                      {uploadError && (
                        <div className="p-3 bg-red-100 border border-red-300 text-red-900 font-sans text-xs font-bold rounded-lg flex items-center gap-2 max-w-lg">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{uploadError}</span>
                        </div>
                      )}

                      {/* Success Upload Image UI */}
                      {uploadedImageUrl && (
                        <div className="w-full border-t border-neutral-200 pt-5 space-y-3 text-left">
                          <div className="flex items-center gap-3 p-3.5 bg-teal-50 border-2 border-teal-500 rounded-xl">
                            <Check className="w-5 h-5 text-teal-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-xs font-black text-teal-800">
                                ছবি সঠিকভাবে আপলোড এবং লিংক তৈরি করা সম্পন্ন হয়েছে!
                              </p>
                              <p className="font-mono text-[9px] text-teal-600 truncate mt-0.5 select-all">
                                {uploadedImageUrl}
                              </p>
                            </div>
                            <button
                              onClick={() => handleCopyUrl(uploadedImageUrl)}
                              className="px-3 py-1.5 bg-neutral-950 text-white font-mono text-2xs font-bold uppercase rounded hover:bg-neutral-800 shadow-[1px_1px_0px_white]"
                            >
                              {copiedUrl ? "কপি করা হয়েছে!" : "লিংক কপি করুন"}
                            </button>
                          </div>

                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 border-2 border-neutral-950 rounded-xl overflow-hidden shrink-0 bg-white shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                              <img src={uploadedImageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-2 flex-1">
                              <p className="text-[11px] font-sans text-neutral-600 leading-normal font-medium">
                                💡 এই কপি করা লিংকটি আপনার যেকোনো কাস্টম কন্টেন্ট বক্সে ইমেজ লিংক বা কাভার ছবি হিসেবে ব্যবহার করতে পারেন।
                              </p>
                              <div className="pt-1 flex flex-wrap gap-2">
                                <button
                                  onClick={() => {
                                    setTempHeroImage(uploadedImageUrl);
                                    onUpdateHeroImage(uploadedImageUrl);
                                    alert("সফলভাবে এই ছবিটিকে হোম পেজ ব্যানার/প্রোফাইল ইমেজ হিসেবে নিযুক্ত করা হয়েছে!");
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-neutral-950 font-mono text-[10px] font-black uppercase border-2 border-neutral-950 rounded shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] cursor-pointer text-xs"
                                >
                                  ✨ সেট করুন হোম পেজ ব্যানার হিসেবে
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setTempAboutMeImage(uploadedImageUrl);
                                    onUpdateAboutMeImage(uploadedImageUrl);
                                    alert("সফলভাবে এই ছবিটিকে পরিচিতি মূল পোর্ট্রেট ছবি হিসেবে নিযুক্ত করা হয়েছে! সংরক্ষণ সম্পূর্ণ করতে সাধারণ ট্যাবে গিয়ে 'হোম কন্টেন্ট তথ্য সেভ করুন' বাটনে ক্লিক করে সেভ সম্পন্ন করুন।");
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 hover:bg-teal-200 text-neutral-950 font-mono text-[10px] font-black uppercase border-2 border-neutral-950 rounded shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] cursor-pointer text-xs"
                                >
                                  📸 সেট করুন মূল পোর্ট্রেট ছবি হিসেবে
                                </button>

                                <button
                                  onClick={() => {
                                    setTempAboutCollabImage(uploadedImageUrl);
                                    onUpdateAboutCollabImage(uploadedImageUrl);
                                    alert("সফলভাবে এই ছবিটিকে কোলাব পোলাড ছবি হিসেবে নিযুক্ত করা হয়েছে! সংরক্ষণ সম্পূর্ণ করতে সাধারণ ট্যাবে গিয়ে 'হোম কন্টেন্ট তথ্য সেভ করুন' বাটনে ক্লিক করে সেভ সম্পন্ন করুন।");
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-neutral-950 font-mono text-[10px] font-black uppercase border-2 border-neutral-950 rounded shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] cursor-pointer text-xs"
                                >
                                  🎞️ সেট করুন কোলাব পোলাড ছবি হিসেবে
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cloudinary Step-by-Step Bangla Tutorial */}
                  <div className="bg-[#FAF9F6] border-2 border-neutral-950 rounded-2xl p-6 text-neutral-900 space-y-4">
                    <h4 className="font-sans text-sm font-black text-neutral-950 border-b pb-1.5 flex items-center gap-2">
                      <HelpCircle className="w-4.5 h-4.5" />
                      Cloudinary সেটিং এবং Unsigned Preset তৈরি করার নিয়ম (Bangla Guide):
                    </h4>
                    <div className="font-sans text-xs text-neutral-700 space-y-2.5 leading-relaxed font-semibold">
                      <p>
                        ১. প্রথমে <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="text-sky-600 underline font-black">cloudinary.com</a> ওয়েবসাইটে গিয়ে একটি সম্পূর্ণ ফ্রি একাউন্ট তৈরি করে নিন।
                      </p>
                      <p>
                        ২. সাইন-ইন বা ড্যাশবোর্ডে প্রবেশের পর আপনার <strong>Cloud Name</strong> টি দেখতে পাবেন। সেটি কপি করে উপরের সেটিংসের <strong>Cloud Name</strong> বক্সে লিখুন।
                      </p>
                      <p>
                        ৩. এরপর ক্লাউডিনারি ড্যাশবোর্ডের একদম নিচে গিয়ার আইকনটিতে (⚙️ / Settings) ক্লিক করুন।
                      </p>
                      <p>
                        ৪. সেটিংস থেকে বামে অবস্থিত <strong>Upload</strong> অপশনে ক্লিক করতে হবে।
                      </p>
                      <p>
                        ৫. একটু স্ক্রল করে নিচে নেমে <strong>Upload presets</strong> অপশনটি খুজে বের করুন এবং <strong>Add upload preset</strong> লিংকে ক্লিক দিন।
                      </p>
                      <p>
                        ৬. এবার প্রিসেটের নাম দিন (যেমন: <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono font-bold text-neutral-900">wedding_preset</code>) এবং সবচেয়ে গুরুত্বপূর্ণ বিষয়— <strong>Signing Mode</strong> অপশনটিকে <strong>Unsigned</strong> সিলেক্ট করে সেভ করুন।
                      </p>
                      <p>
                        ৭. ব্যাস! সেই নাম এবং ক্লাউড নেম বসিয়ে এখানে যেকোনো ছবি ড্রপ করলেই কোনো সার্ভার ছাড়াই ছবি সরাসরি আপলোড হবে এবং নিরাপদ ইমেজ লিংক তৈরি হয়ে যাবে!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PROJECTS MANAGEMENT (View, Add, Edit, Delete) */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-sans text-lg font-black text-[#121212] border-b-2 border-neutral-950 pb-2 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-amber-500" />
                      পোর্টফোলিও প্রজেক্ট ম্যানেজমেন্ট
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-medium mt-1">
                      ওয়েবসাইটের "Featured Work" সেকশনে প্রদর্শিত ছবি, শিরোনাম ও স্লাইড গ্যালারি পরিচালনা করুন।
                    </p>
                  </div>

                  {/* Project Input Form */}
                  <div className="bg-amber-50/50 border-3 border-neutral-950 rounded-2xl p-5 sm:p-6 text-neutral-950 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-4">
                    <h4 className="font-sans text-sm font-black flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      {editingProjectId ? "প্রজেক্ট তথ্য এডিট করুন" : "নতুন প্রজেক্ট বা পোর্টফোলিও যুক্ত করুন"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Title */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Project Title (শিরোনাম)</label>
                        <input
                          type="text"
                          placeholder="যেমন: Timeless Mughal Crimson"
                          value={newProject.title || ""}
                          onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-bold text-neutral-900 focus:outline-none"
                        />
                      </div>

                      {/* Couple Names */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Couple Names / Subject</label>
                        <input
                          type="text"
                          placeholder="যেমন: Farhan & Shama"
                          value={newProject.coupleNames || ""}
                          onChange={(e) => setNewProject(p => ({ ...p, coupleNames: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-bold text-neutral-900 focus:outline-none"
                        />
                      </div>

                      {/* Year */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Year (বছর)</label>
                        <input
                          type="text"
                          value={newProject.year || ""}
                          onChange={(e) => setNewProject(p => ({ ...p, year: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Category (ক্যাটাগরি)</label>
                        <select
                          value={newProject.category || "photography"}
                          onChange={(e) => setNewProject(p => ({ ...p, category: e.target.value as any }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                        >
                          <option value="photography">Wedding Stories (ফটোগ্রাফি)</option>
                          <option value="couple-shoot">Couple Sessions (কাপল শুট)</option>
                          <option value="traditional">Retouch Masterclass (রিয়া ডার্কমেট)</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Location (স্থান)</label>
                        <input
                          type="text"
                          placeholder="যেমন: Mymensingh"
                          value={newProject.location || ""}
                          onChange={(e) => setNewProject(p => ({ ...p, location: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-bold text-neutral-900 focus:outline-none"
                        />
                      </div>

                      {/* Cover Photo */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Cover Image URL (কাভার ছবি)</label>
                        <input
                          type="text"
                          placeholder="Cloudinary লিঙ্ক পেস্ট করুন..."
                          value={newProject.mainImage || ""}
                          onChange={(e) => setNewProject(p => ({ ...p, mainImage: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                        />
                        <div className="pt-1.5 flex flex-col gap-1">
                          <input
                            type="file"
                            id="project-cover-uploader-input"
                            accept="image/*"
                            className="hidden"
                            disabled={projectCoverUploadLoading}
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files || files.length === 0) return;
                              const file = files[0];
                              if (!cloudName || !uploadPreset) {
                                alert("দয়া করে প্রথমে 'Cloudinary ও আপলোডার' ট্যাবে গিয়ে Cloud Name এবং Upload Preset সেট করুন!");
                                return;
                              }
                              setProjectCoverUploadLoading(true);
                              try {
                                const compressedFile = await compressImage(file);
                                const formData = new FormData();
                                formData.append("file", compressedFile);
                                formData.append("upload_preset", uploadPreset);
                                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
                                  method: "POST",
                                  body: formData
                                });
                                if (!res.ok) {
                                  const errData = await res.json().catch(() => ({}));
                                  const details = errData.error?.message || "";
                                  throw new Error(`আপলোড ব্যর্থ হয়েছে! ${details ? `(${details}) ` : ""}Cloudinary ড্যাশবোর্ড সেটিংস চেক করুন।`);
                                }
                                const data = await res.json();
                                if (data.secure_url) {
                                  setNewProject(p => ({ ...p, mainImage: data.secure_url }));
                                  alert("প্রজেক্ট কাভার ছবি সফলভাবে আপলোড ও যুক্ত হয়েছে!");
                                } else {
                                  throw new Error("Secure URL not found in Cloudinary reply.");
                                }
                              } catch (err: any) {
                                alert(err.message || "ছবি আপলোড করার সময় কোনো সমস্যা হয়েছে!");
                              } finally {
                                setProjectCoverUploadLoading(false);
                              }
                            }}
                          />
                          {projectCoverUploadLoading ? (
                            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 bg-neutral-100 p-1.5 border border-neutral-300 rounded">
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 border-t-transparent animate-spin inline-block" />
                              <span>আপলোড হচ্ছে...</span>
                            </div>
                          ) : (
                            <label
                              htmlFor="project-cover-uploader-input"
                              className="inline-flex items-center gap-1 bg-teal-100 hover:bg-teal-200 text-neutral-950 font-mono text-[9px] uppercase font-black px-2 py-1.5 border-2 border-neutral-950 rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer transition-all hover:translate-y-[-1px] w-fit"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>সরাসরি ছবি আপলোড করুন</span>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Tagline */}
                      <div className="sm:col-span-2 md:col-span-3 space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Short Description / Tagline (বর্ণনা)</label>
                        <input
                          type="text"
                          placeholder="যেমন: High-end skin retouching and classic skin toning capturing heritage..."
                          value={newProject.tagline || ""}
                          onChange={(e) => setNewProject(p => ({ ...p, tagline: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-semibold text-neutral-905 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Sub Gallery Images adder */}
                    <div className="border border-neutral-300 p-4 rounded-xl bg-white space-y-4">
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500 block">
                          Gallery Images Slider List (লাইটবক্স গ্যালারি স্লাইড)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Cloudinary লাইটবক্স ছবির ইউআরএল লিঙ্ক পেস্ট করুন..."
                            value={newGalleryInput}
                            onChange={(e) => setNewGalleryInput(e.target.value)}
                            className="flex-1 p-2 bg-white border-2 border-neutral-950 rounded-lg font-mono text-xs text-neutral-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddGalleryImage}
                            className="px-3.5 py-1 bg-yellow-300 border-2 border-neutral-950 text-neutral-950 font-mono text-xs font-black uppercase text-center rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                          >
                            যোগ করুন
                          </button>
                        </div>
                        
                        <div className="pt-1.5 flex flex-col gap-1 text-left">
                          <input
                            type="file"
                            id="project-gallery-uploader-input"
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={projectGalleryUploadLoading}
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files || files.length === 0) return;
                              if (!cloudName || !uploadPreset) {
                                alert("দয়া করে প্রথমে 'Cloudinary ও আপলোডার' ট্যাবে গিয়ে Cloud Name এবং Upload Preset সেট করুন!");
                                return;
                              }
                              setProjectGalleryUploadLoading(true);
                              let successCount = 0;
                              const uploadedUrls: string[] = [];
                              
                              for (let i = 0; i < files.length; i++) {
                                const file = files[i];
                                try {
                                  const compressedFile = await compressImage(file);
                                  const formData = new FormData();
                                  formData.append("file", compressedFile);
                                  formData.append("upload_preset", uploadPreset);
                                  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
                                    method: "POST",
                                    body: formData
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    if (data.secure_url) {
                                      uploadedUrls.push(data.secure_url);
                                      successCount++;
                                    }
                                  }
                                } catch (err) {
                                  console.error("Gallery file upload block error:", err);
                                }
                              }
                              
                              if (uploadedUrls.length > 0) {
                                setNewProject(p => ({
                                  ...p,
                                  galleryImages: [...(p.galleryImages || []), ...uploadedUrls]
                                }));
                                alert(`${successCount} টি ছবি সফলভাবে আপলোড ও গ্যালারিতে সরাসরি যোগ হয়েছে!`);
                              } else {
                                alert("কোনো ছবি আপলোড করা সম্ভব হয়নি! প্রিসেট এবং নেটওয়ার্ক চেক করুন।");
                              }
                              setProjectGalleryUploadLoading(false);
                            }}
                          />
                          {projectGalleryUploadLoading ? (
                            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 bg-neutral-100 p-1.5 border border-neutral-300 rounded">
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 border-t-transparent animate-spin inline-block" />
                              <span>গ্যালারি ছবি আপলোড হচ্ছে...</span>
                            </div>
                          ) : (
                            <label
                              htmlFor="project-gallery-uploader-input"
                              className="inline-flex items-center gap-1 bg-teal-100 hover:bg-teal-200 text-neutral-950 font-mono text-[9px] uppercase font-black px-2 py-1.5 border-2 border-neutral-950 rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer transition-all hover:translate-y-[-1px] w-fit"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>ছবি সরাসরি আপলোড করে যোগ করুন (একাধিক ছবি একসাথে সিলেক্ট করা যাবে)</span>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Render preview of added sub images */}
                      {newProject.galleryImages && newProject.galleryImages.length > 0 && (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                          {newProject.galleryImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square border border-neutral-400 rounded-lg group overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      {editingProjectId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(null);
                            setNewProject({
                              title: "",
                              coupleNames: "",
                              location: "",
                              year: "2026",
                              category: "photography",
                              mainImage: "",
                              tagline: "",
                              galleryImages: []
                            });
                          }}
                          className="px-4 py-2 bg-neutral-100 border-2 border-neutral-950 text-neutral-950 font-mono text-xs font-bold uppercase rounded-xl shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer"
                        >
                          বাতিল
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={handleAddProject}
                        className="px-6 py-2.5 bg-yellow-300 border-2 border-neutral-950 text-neutral-950 font-mono text-xs font-black uppercase rounded-xl shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-transform cursor-pointer"
                      >
                        {editingProjectId ? "পরিবর্তন সেভ করুন" : "কাজটি পাবলিশ করুন"}
                      </button>
                    </div>
                  </div>

                  {/* List of current projects */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-2xs uppercase tracking-wider font-extrabold text-neutral-400">
                      বর্তমান পোর্টফোলিওর কাজসমূহ:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div key={proj.id} className="flex p-3 bg-white border-2 border-neutral-950 rounded-2xl relative shadow-[2px_2px_0px_rgba(0,0,0,1)] items-start gap-3">
                          <img 
                            src={proj.mainImage} 
                            alt={proj.title} 
                            className="w-20 h-20 bg-neutral-100 object-cover border border-neutral-950 rounded-xl shrink-0" 
                          />
                          <div className="flex-1 text-left min-w-0 space-y-1">
                            <span className="text-[9px] font-mono font-bold bg-neutral-150 px-1.5 py-0.5 rounded border border-neutral-300">
                              {proj.category}
                            </span>
                            <h5 className="font-sans text-xs font-black truncate text-neutral-900 leading-tight">
                              {proj.title}
                            </h5>
                            <p className="font-sans text-[10px] text-neutral-500 font-bold">
                              {proj.coupleNames || "No Name"} • {proj.year}
                            </p>
                            <p className="text-[10px] text-neutral-400 truncate">{proj.tagline}</p>
                          </div>

                          <div className="flex gap-1.5 shrink-0 self-center">
                            <button
                              onClick={() => handleEditProjectClick(proj)}
                              className="p-1.5 border border-neutral-950 bg-teal-100 rounded hover:opacity-85 text-neutral-950"
                              title="এডিট"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1.5 border border-neutral-950 bg-red-100 rounded hover:opacity-85 text-neutral-950"
                              title="ডিলিট"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SERVICES MANAGEMENT */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-sans text-lg font-black text-neutral-900 border-b-2 border-neutral-950 pb-2 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-teal-500" />
                      সার্ভিসেস ও প্রাইসিং ম্যানেজমেন্ট
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-medium mt-1">
                      আপনার গ্রাহকদের জন্য আপনি কি কি সার্ভিস দেন এবং তাদের প্যাকেজের রেট ইচ্ছে মতন কাস্টমাইজ করুন।
                    </p>
                  </div>

                  {/* Input Form for Services */}
                  <div className="bg-teal-50/50 border-3 border-neutral-950 rounded-2xl p-5 sm:p-6 text-neutral-950 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-4">
                    <h4 className="font-sans text-sm font-black">
                      {editingServiceId ? "সার্ভিস প্যাকেজ এডিট করুন" : "নতুন কোন সার্ভিস যুক্ত করুন"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Service Title</label>
                        <input
                          type="text"
                          placeholder="যেমন: Wedding Storytelling"
                          value={newService.title || ""}
                          onChange={(e) => setNewService(s => ({ ...s, title: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-bold text-neutral-900 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Subtitle (কাজের ধরণ)</label>
                        <input
                          type="text"
                          placeholder="যেমন: Candid captures & memories"
                          value={newService.subtitle || ""}
                          onChange={(e) => setNewService(s => ({ ...s, subtitle: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-bold text-neutral-900 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Starting Price (রেট)</label>
                        <input
                          type="text"
                          placeholder="যেমন: ৳45,000 / $550"
                          value={newService.startingPrice || ""}
                          onChange={(e) => setNewService(s => ({ ...s, startingPrice: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-bold text-neutral-900 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Icon Key Name</label>
                        <select
                          value={newService.iconName || "Camera"}
                          onChange={(e) => setNewService(s => ({ ...s, iconName: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                        >
                          <option value="Camera">Camera (ক্যামেরা)</option>
                          <option value="Sparkles">Sparkles (গ্লোইং স্টার)</option>
                          <option value="Heart">Heart (ভালোবাসা)</option>
                          <option value="Sliders">Sliders (টিউনিং টুল)</option>
                          <option value="Laptop">Laptop (কম্পিউটার)</option>
                          <option value="Globe">Globe (ওয়ার্ল্ড)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Service Description (সার্ভিসের বিস্তারিত বিবরণ)</label>
                        <input
                          type="text"
                          placeholder="প্যাকেজে কি কি থাকছে তার একটি বিস্তারিত শর্ট বর্ণনা দিন..."
                          value={newService.description || ""}
                          onChange={(e) => setNewService(s => ({ ...s, description: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-semibold text-neutral-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Deliverables lists */}
                    <div className="border border-neutral-305 p-4 rounded-xl bg-white space-y-3">
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500 block">Deliverables Bullet Lines (কি কি ফাইল পাবেন গ্রাহকরা)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="যেমন: Unlimited RAW files, 100+ fine raw editing etc."
                            value={newDeliverableInput}
                            onChange={(e) => setNewDeliverableInput(e.target.value)}
                            className="flex-1 p-2 bg-white border-2 border-neutral-950 rounded-lg font-sans text-xs font-black text-neutral-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddDeliverable}
                            className="px-4 py-1 bg-yellow-300 border-2 border-neutral-950 text-neutral-950 font-mono text-xs font-black uppercase rounded-lg"
                          >
                            যোগ করুন
                          </button>
                        </div>
                      </div>

                      {newService.deliverables && newService.deliverables.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newService.deliverables.map((del, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-55 border border-teal-500 rounded-lg text-xs font-sans font-bold text-neutral-900">
                              <span>{del}</span>
                              <button type="button" onClick={() => handleRemoveDeliverable(idx)} className="hover:text-red-500 font-extrabold text-xs">×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      {editingServiceId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingServiceId(null);
                            setNewService({
                              title: "",
                              subtitle: "",
                              description: "",
                              startingPrice: "",
                              deliverables: [],
                              iconName: "Camera"
                            });
                          }}
                          className="px-4 py-2 bg-neutral-100 border-2 border-neutral-950 text-neutral-950 font-mono text-xs font-bold uppercase rounded-xl cursor-pointer"
                        >
                          বাতিল
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleSaveService}
                        className="px-6 py-2.5 bg-yellow-300 border-2 border-neutral-950 text-neutral-950 font-mono text-xs font-black uppercase rounded-xl shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-transform cursor-pointer"
                      >
                        {editingServiceId ? "পরিবর্তন সেভ করুন" : "সার্ভিস যুক্ত করুন"}
                      </button>
                    </div>
                  </div>

                  {/* Render existing services list */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-2xs uppercase tracking-wider font-extrabold text-neutral-400 font-bold">
                      চলমান সার্ভিস লিস্টেড:
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((serv) => (
                        <div key={serv.id} className="p-4 bg-[#FAF9F6] border-2 border-neutral-950 rounded-2xl relative text-left shadow-[2px_2px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                          <div className="space-y-1.5">
                            <h5 className="font-sans text-sm font-black text-neutral-950">{serv.title}</h5>
                            <p className="font-sans text-xs text-neutral-500 font-bold">{serv.subtitle}</p>
                            <p className="font-mono text-[10px] bg-white border border-neutral-300 px-2 py-0.5 rounded-full w-fit">
                              Starting Rates: {serv.startingPrice}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditServiceClick(serv)}
                              className="p-1.5 border border-neutral-950 bg-teal-100 rounded hover:opacity-85 text-neutral-950"
                              title="এডিট"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(serv.id)}
                              className="p-1.5 border border-neutral-950 bg-red-100 rounded hover:opacity-85 text-neutral-950"
                              title="ডিলিট"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TESTIMONIALS MANAGEMENT */}
              {activeTab === "testimonials" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-sans text-lg font-black text-neutral-900 border-b-2 border-neutral-950 pb-2 flex items-center gap-2">
                      <Award className="w-5 h-5 text-pink-500" />
                      গ্রাহকদের ফিডব্যাক ও রিভিউ এডিটর
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-medium mt-1">
                      গ্রাহকদের কাছ থেকে পাওয়া সুন্দর পরামর্শ এবং প্রশংসাসূচক রিভিউ সাইটে প্রকাশ ও আপডেট করুন।
                    </p>
                  </div>

                  {/* Input form for Testimonial */}
                  <div className="bg-pink-50/50 border-3 border-neutral-950 rounded-2xl p-5 sm:p-6 text-neutral-950 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-4">
                    <h4 className="font-sans text-sm font-black">
                      {editingTestimonialId ? "গ্রাহকের ফিডব্যাক সোধরান" : "নতুন ফিডব্যাক যুক্ত করুন"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Name */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Client Name (গ্রাহকের নাম)</label>
                        <input
                          type="text"
                          placeholder="যেমন: Zayan & Maria"
                          value={newTestimonial.author || ""}
                          onChange={(e) => setNewTestimonial(t => ({ ...t, author: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-bold text-neutral-900 focus:outline-none"
                        />
                      </div>

                      {/* Role */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Role / Designations</label>
                        <input
                          type="text"
                          value={newTestimonial.role || ""}
                          onChange={(e) => setNewTestimonial(t => ({ ...t, role: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-semibold text-neutral-900 focus:outline-none"
                        />
                      </div>

                      {/* Rating */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Rating Stars (৫ এর মধ্যে)</label>
                        <select
                          value={newTestimonial.rating || 5}
                          onChange={(e) => setNewTestimonial(t => ({ ...t, rating: parseInt(e.target.value) }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                          <option value="3">⭐⭐⭐ (3 Stars)</option>
                        </select>
                      </div>

                      {/* Guest Photo Link */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Photo URL (গ্রাহকের ছবি লিংক)</label>
                        <input
                          type="text"
                          placeholder="Cloudinary বা আনস্প্ল্যাশ লিঙ্ক পেস্ট করুন..."
                          value={newTestimonial.image || ""}
                          onChange={(e) => setNewTestimonial(t => ({ ...t, image: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                        />
                        <div className="pt-1.5 flex flex-col gap-1">
                          <input
                            type="file"
                            id="testimonial-uploader-input"
                            accept="image/*"
                            className="hidden"
                            disabled={testimonialUploadLoading}
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files || files.length === 0) return;
                              const file = files[0];
                              if (!cloudName || !uploadPreset) {
                                alert("দয়া করে প্রথমে 'Cloudinary ও আপলোডার' ট্যাবে গিয়ে Cloud Name এবং Upload Preset সেট করুন!");
                                return;
                              }
                              setTestimonialUploadLoading(true);
                              try {
                                const compressedFile = await compressImage(file);
                                const formData = new FormData();
                                formData.append("file", compressedFile);
                                formData.append("upload_preset", uploadPreset);
                                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
                                  method: "POST",
                                  body: formData
                                });
                                if (!res.ok) {
                                  const errData = await res.json().catch(() => ({}));
                                  const details = errData.error?.message || "";
                                  throw new Error(`আপলোড ব্যর্থ হয়েছে! ${details ? `(${details}) ` : ""}Cloudinary ড্যাশবোর্ড সেটিংস চেক করুন।`);
                                }
                                const data = await res.json();
                                if (data.secure_url) {
                                  setNewTestimonial(t => ({ ...t, image: data.secure_url }));
                                  alert("গ্রাহকের ছবি সফলভাবে আপলোড ও যুক্ত হয়েছে!");
                                } else {
                                  throw new Error("Secure URL not found in Cloudinary reply.");
                                }
                              } catch (err: any) {
                                alert(err.message || "ছবি আপলোড করার সময় কোনো সমস্যা হয়েছে!");
                              } finally {
                                setTestimonialUploadLoading(false);
                              }
                            }}
                          />
                          {testimonialUploadLoading ? (
                            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 bg-neutral-100 p-1.5 border border-neutral-300 rounded">
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 border-t-transparent animate-spin inline-block" />
                              <span>আপলোড হচ্ছে...</span>
                            </div>
                          ) : (
                            <label
                              htmlFor="testimonial-uploader-input"
                              className="inline-flex items-center gap-1 bg-teal-100 hover:bg-teal-200 text-neutral-950 font-mono text-[9px] uppercase font-black px-2 py-1.5 border-2 border-neutral-950 rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer transition-all hover:translate-y-[-1px] w-fit"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>সরাসরি ছবি আপলোড করুন</span>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Location (অনুষ্ঠানের স্থান)</label>
                        <input
                          type="text"
                          placeholder="যেমন: Mymensingh Ceremony"
                          value={newTestimonial.location || ""}
                          onChange={(e) => setNewTestimonial(t => ({ ...t, location: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-bold text-neutral-900 focus:outline-none"
                        />
                      </div>

                      {/* Event Date */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Event Date / Details</label>
                        <input
                          type="text"
                          placeholder="যেমন: December 2024"
                          value={newTestimonial.eventDate || ""}
                          onChange={(e) => setNewTestimonial(t => ({ ...t, eventDate: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none"
                        />
                      </div>

                      {/* Review Message */}
                      <div className="sm:col-span-2 md:col-span-3 space-y-1 text-left">
                        <label className="font-mono text-2xs uppercase font-extrabold text-neutral-500">Review Message text (গ্রাহকের বক্তব্য)</label>
                        <textarea
                          rows={3}
                          placeholder="গ্রাহকের পাঠানো মিষ্টি প্রশংসার বিবরণ দিন..."
                          value={newTestimonial.text || ""}
                          onChange={(e) => setNewTestimonial(t => ({ ...t, text: e.target.value }))}
                          className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs font-semibold text-neutral-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      {editingTestimonialId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTestimonialId(null);
                            setNewTestimonial({
                              author: "",
                              role: "Bride & Groom",
                              text: "",
                              rating: 5,
                              image: "",
                              location: "Mymensingh Ceremony",
                              eventDate: "2026"
                            });
                          }}
                          className="px-4 py-2 bg-neutral-100 border-2 border-neutral-950 text-neutral-950 font-mono text-xs font-bold uppercase rounded-xl cursor-pointer"
                        >
                          বাতিল
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleSaveTestimonial}
                        className="px-6 py-2.5 bg-yellow-300 border-2 border-neutral-950 text-neutral-950 font-mono text-xs font-black uppercase rounded-xl shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-transform cursor-pointer"
                      >
                        {editingTestimonialId ? "পরিবর্তন সেভ করুন" : "রিভিউ সংরক্ষণ করুন"}
                      </button>
                    </div>
                  </div>

                  {/* Read List of existing Feedbacks */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-2xs uppercase tracking-wider font-extrabold text-neutral-400 block font-bold">
                      চলমান প্রকাশিত রিভিউসমূহ:
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      {testimonials.map((t) => (
                        <div key={t.id} className="flex p-4 bg-white border-2 border-neutral-950 rounded-2xl relative text-left shadow-[2px_2px_0px_rgba(0,0,0,1)] items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={t.image} alt={t.author} className="w-11 h-11 rounded-full border border-neutral-950 object-cover shrink-0 bg-neutral-100" />
                            <div>
                              <h5 className="font-sans text-sm font-black text-neutral-900">{t.author}</h5>
                              <p className="font-sans text-[10px] text-neutral-500 font-bold">{t.role} • {t.location}</p>
                              <p className="text-[11px] text-neutral-700 italic border-l-2 border-yellow-300 pl-2 mt-1 line-clamp-2 leading-relaxed">{t.text}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditTestimonialClick(t)}
                              className="p-1.5 border border-neutral-950 bg-teal-101 bg-teal-100 rounded hover:opacity-85 text-neutral-950"
                              title="এডিট"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="p-1.5 border border-neutral-950 bg-red-100 rounded hover:opacity-85 text-neutral-950"
                              title="ডিলিট"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: PREMIUM GEAR MANAGEMENT */}
              {activeTab === "gear" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-sans text-lg font-black text-neutral-900 border-b-2 border-neutral-950 pb-2 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-neutral-950" />
                      আমার প্রিমিয়াম গিয়ার সেটিংস (My Premium Gear)
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-medium mt-1">
                      হোমপেজের 'Behind The Frames' সেকশনের ক্যামেরা বডি, লেন্স, লাইটিং ও মডিফায়ারসমূহ এখান থেকে সরাসরি যুক্ত, এডিট বা ডিলিট করতে পারবেন।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form block */}
                    <div className="lg:col-span-1 bg-[#FAF9F6] border-2 border-neutral-950 p-5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] h-fit space-y-4">
                      <h4 className="font-sans text-sm font-black text-neutral-900 uppercase tracking-wider">
                        {editingGearId ? "গিয়ার এডিট করুন (Edit)" : "নতুন গিয়ার যোগ করুন (Add)"}
                      </h4>

                      <form onSubmit={handleAddOrUpdateGear} className="space-y-3.5">
                        {/* Name */}
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-neutral-500">গিয়ারের নাম (Gear Name)</label>
                          <input
                            type="text"
                            required
                            value={newGear.name || ""}
                            onChange={(e) => setNewGear(g => ({ ...g, name: e.target.value }))}
                            placeholder="যেমন: Sony a7IV"
                            className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs text-neutral-950 focus:outline-none"
                          />
                        </div>

                        {/* Specs */}
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-neutral-500">স্পেসিফিকেশন (Specs)</label>
                          <input
                            type="text"
                            value={newGear.specs || ""}
                            onChange={(e) => setNewGear(g => ({ ...g, specs: e.target.value }))}
                            placeholder="যেমন: 33MP • 4K 60p • Dual Card Slots"
                            className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs text-neutral-950 focus:outline-none"
                          />
                        </div>

                        {/* Category & Tag */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-mono text-[10px] uppercase font-bold text-neutral-500">ক্যাটাগরি</label>
                            <select
                              value={newGear.category || "bodies"}
                              onChange={(e) => setNewGear(g => ({ ...g, category: e.target.value as any }))}
                              className="w-full p-2 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs text-neutral-950 focus:outline-none"
                            >
                              <option value="bodies">Camera Bodies</option>
                              <option value="lenses">Prime Lenses</option>
                              <option value="lighting">Lighting Systems</option>
                              <option value="modifiers">Softboxes & Grids</option>
                              <option value="workstations">Editing Workstations</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[10px] uppercase font-bold text-neutral-500">ট্যাগ (Tag)</label>
                            <input
                              type="text"
                              value={newGear.tag || ""}
                              onChange={(e) => setNewGear(g => ({ ...g, tag: e.target.value }))}
                              placeholder="যেমন: Primary Body"
                              className="w-full p-2 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs text-neutral-950 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Tag Color */}
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-neutral-500">ট্যাগ কালার (Color Theme)</label>
                          <select
                            value={newGear.tagColor || "bg-yellow-400"}
                            onChange={(e) => setNewGear(g => ({ ...g, tagColor: e.target.value }))}
                            className="w-full p-2 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs text-neutral-950 focus:outline-none"
                          >
                            <option value="bg-red-400">Red (লাল)</option>
                            <option value="bg-yellow-400">Yellow (হলুদ)</option>
                            <option value="bg-teal-300">Teal (টিয়া)</option>
                            <option value="bg-indigo-300">Indigo (বেগুনী)</option>
                            <option value="bg-purple-300">Purple (পার্পল)</option>
                            <option value="bg-orange-400">Orange (কমলা)</option>
                            <option value="bg-pink-300">Pink (গোলাপী)</option>
                            <option value="bg-emerald-300">Emerald (সবুজ)</option>
                            <option value="bg-cyan-300">Cyan (আকাশি)</option>
                          </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-neutral-500">বিবরণ (Description)</label>
                          <textarea
                            value={newGear.description || ""}
                            onChange={(e) => setNewGear(g => ({ ...g, description: e.target.value }))}
                            placeholder="এই গিয়ারটি দিয়ে আপনি কী ধরণের কাজ করেন তা সংক্ষেপে লিখুন..."
                            rows={3}
                            className="w-full p-2.5 bg-white border-2 border-neutral-950 rounded-xl font-sans text-xs text-neutral-950 focus:outline-none resize-none leading-relaxed"
                          />
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <button
                            type="submit"
                            className="flex-1 bg-yellow-300 hover:bg-yellow-400 border-2 border-neutral-950 p-2.5 text-xs font-mono font-bold uppercase rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer"
                          >
                            {editingGearId ? "হালনাগাদ করুন" : "যোগ করুন"}
                          </button>
                          
                          {editingGearId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingGearId(null);
                                setNewGear({
                                  name: "",
                                  category: "bodies",
                                  categoryLabel: "Camera Body",
                                  specs: "",
                                  description: "",
                                  tag: "",
                                  tagColor: "bg-red-400"
                                });
                              }}
                              className="bg-neutral-100 hover:bg-neutral-200 border-2 border-neutral-950 px-3 py-2.5 text-xs font-mono font-bold uppercase rounded-xl cursor-pointer"
                            >
                              রিসেট
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Live list block */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b-2 border-neutral-950">
                        <h4 className="font-sans text-sm font-black text-neutral-900 uppercase">
                          বর্তমান গিয়ার তালিকা ({gearItems.length} টি)
                        </h4>
                      </div>

                      {gearItems.length === 0 ? (
                        <div className="p-12 text-center bg-[#FAF9F6] border-2 border-dashed border-neutral-300 rounded-2xl text-neutral-400 space-y-1">
                          <Camera className="w-8 h-8 mx-auto text-neutral-300" />
                          <p className="font-sans text-xs font-semibold">কোনো গিয়ার তালিকাভুক্ত নেই। ডানপাশের ফর্ম থেকে যোগ করুন।</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                          {gearItems.map((gear) => (
                            <div
                              key={gear.id}
                              className="bg-white border-2 border-neutral-950 p-4 rounded-xl shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] relative flex flex-col justify-between text-left"
                            >
                              <div>
                                <div className="flex justify-between items-start gap-1 pb-2 border-b border-dashed border-neutral-200">
                                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                                    {gear.categoryLabel || gear.category}
                                  </span>
                                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase border border-neutral-950 rounded ${gear.tagColor}`}>
                                    {gear.tag}
                                  </span>
                                </div>

                                <h5 className="font-sans text-sm font-extrabold text-neutral-950 mt-2 leading-tight">
                                  {gear.name}
                                </h5>

                                <p className="font-mono text-[9px] font-semibold text-neutral-500 mt-0.5">
                                  {gear.specs}
                                </p>

                                <p className="font-sans text-[11px] leading-relaxed text-neutral-600 font-semibold mt-2 line-clamp-2">
                                  {gear.description}
                                </p>
                              </div>

                              <div className="flex justify-end gap-1.5 mt-4 pt-2 border-t border-neutral-100">
                                <button
                                  type="button"
                                  onClick={() => handleEditGearClick(gear)}
                                  className="px-2 py-1 bg-teal-101 bg-teal-100 hover:bg-teal-200 border border-neutral-950 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                                  title="এডিট"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>এডিট</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGear(gear.id)}
                                  className="px-2 py-1 bg-red-100 hover:bg-red-200 border border-neutral-950 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                                  title="ডিলিট"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>ডিলিট</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: BOOKINGS INQUIRIES VIEW */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-sans text-lg font-black text-neutral-900 border-b-2 border-neutral-950 pb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-red-400" />
                      গ্রাহকদের বুকিং ইনকোয়ারি সমূহের তালিকা (Live Logs)
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-medium mt-1">
                      ওয়েবসাইটের বুকিং ফরম থেকে সম্মানিত গ্রাহকরা যেসব বিয়ের অনুষ্ঠানের জন্য বা ছবির এডিটের জন্য রিকোয়েস্ট করেছেন, তার সম্পূর্ণ তালিকা এখানে দেখুন।
                    </p>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="p-12 text-center bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-2xl text-neutral-400 space-y-2">
                      <Clipboard className="w-10 h-10 mx-auto text-neutral-300" />
                      <p className="font-sans text-xs font-bold text-neutral-500 uppercase tracking-widest">বুকিং এখনো পাওয়া যায়নি!</p>
                      <p className="font-sans text-2xs text-neutral-400 leading-normal max-w-sm mx-auto">
                        কন্টাক্ট ফরম পূরণ করে টেস্ট মেসেজ পাঠালেই তা সাথে সাথে এই লিস্টে আপডেট হবে।
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((book, idx) => (
                        <div key={idx} className="bg-[#FAF9F6] border-2 border-neutral-950 rounded-2.5xl p-5 text-left relative shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 transition-colors">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-neutral-200">
                            <div>
                              <h4 className="font-sans text-base font-black text-neutral-950">
                                {book.name}
                              </h4>
                              <p className="font-mono text-2xs uppercase tracking-wider text-neutral-400 mt-1">
                                {book.email} • {book.phone || "No phone added"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 text-2xs font-mono">
                              <span className="px-2.5 py-1 bg-yellow-300 border border-neutral-950 text-neutral-950 font-bold uppercase rounded-lg">
                                Category: {book.eventType}
                              </span>
                              {book.eventDate && (
                                <span className="px-2.5 py-1 bg-white border border-neutral-950 text-neutral-950 font-bold uppercase rounded-lg">
                                  Date: {book.eventDate}
                                </span>
                              )}
                              <span className="px-2.5 py-1 bg-teal-100 border border-neutral-950 text-neutral-950 font-extrabold uppercase rounded-lg">
                                Budget: {book.budget}
                              </span>
                            </div>
                          </div>

                          <div className="pt-4 text-xs leading-relaxed text-neutral-700 font-sans font-semibold">
                            <p className="text-neutral-400 font-mono text-[9px] uppercase tracking-widest font-black mb-1.5">গ্রাহকের বুকিং বার্তা:</p>
                            <p className="bg-white p-3 border border-neutral-300 rounded-xl min-h-[50px] leading-relaxed">
                              {book.message || "কোনো বাড়তি টেক্সট বার্তা যুক্ত করা হয়নি।"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
          </>
        )}

      </motion.div>
    </div>
  );
}
