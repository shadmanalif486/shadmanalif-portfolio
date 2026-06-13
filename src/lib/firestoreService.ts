import { 
  collection, doc, getDoc, getDocs, setDoc, deleteDoc, 
  query, orderBy 
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { Project, Service, Testimonial, BookingSubmission, GearItem } from "../types";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to recursively strip undefined properties so that setDoc doesn't fail
export function cleanUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj as any;
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined) as unknown as T;
  }
  if (typeof obj === "object") {
    const cleaned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = (obj as any)[key];
        if (val !== undefined) {
          cleaned[key] = cleanUndefined(val);
        }
      }
    }
    return cleaned as T;
  }
  return obj;
}

// 1. Config Service
export async function fetchConfig() {
  const path = "config/home";
  try {
    const docRef = doc(db, "config", "home");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as {
        heroImageUrl: string;
        homeTitle: string;
        aboutMeImageUrl: string;
        aboutCollabImageUrl: string;
        aboutMeImageFit: string;
        cloudinaryCloudName?: string;
        cloudinaryUploadPreset?: string;
      };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveConfig(config: {
  heroImageUrl: string;
  homeTitle: string;
  aboutMeImageUrl: string;
  aboutCollabImageUrl: string;
  aboutMeImageFit: string;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
}) {
  const path = "config/home";
  try {
    const docRef = doc(db, "config", "home");
    await setDoc(docRef, cleanUndefined(config));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 2. Services Service
export async function fetchServices(): Promise<Service[]> {
  const path = "services";
  try {
    const colRef = collection(db, "services");
    const snap = await getDocs(colRef);
    const services: Service[] = [];
    snap.forEach((doc) => {
      services.push(doc.data() as Service);
    });
    return services;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveService(service: Service) {
  const path = `services/${service.id}`;
  try {
    const docRef = doc(db, "services", service.id);
    await setDoc(docRef, cleanUndefined(service));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function removeService(id: string) {
  const path = `services/${id}`;
  try {
    const docRef = doc(db, "services", id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 3. Projects Service
export async function fetchProjects(): Promise<Project[]> {
  const path = "projects";
  try {
    const colRef = collection(db, "projects");
    const snap = await getDocs(colRef);
    const projects: Project[] = [];
    snap.forEach((doc) => {
      projects.push(doc.data() as Project);
    });
    return projects;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveProject(project: Project) {
  const path = `projects/${project.id}`;
  try {
    const docRef = doc(db, "projects", project.id);
    await setDoc(docRef, cleanUndefined(project));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function removeProject(id: string) {
  const path = `projects/${id}`;
  try {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 4. Testimonials Service
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const path = "testimonials";
  try {
    const colRef = collection(db, "testimonials");
    const snap = await getDocs(colRef);
    const testimonials: Testimonial[] = [];
    snap.forEach((doc) => {
      testimonials.push(doc.data() as Testimonial);
    });
    return testimonials;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveTestimonial(testimonial: Testimonial) {
  const path = `testimonials/${testimonial.id}`;
  try {
    const docRef = doc(db, "testimonials", testimonial.id);
    await setDoc(docRef, cleanUndefined(testimonial));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function removeTestimonial(id: string) {
  const path = `testimonials/${id}`;
  try {
    const docRef = doc(db, "testimonials", id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 5. Gear items Service
export async function fetchGearItems(): Promise<GearItem[]> {
  const path = "gear_items";
  try {
    const colRef = collection(db, "gear_items");
    const snap = await getDocs(colRef);
    const gear: GearItem[] = [];
    snap.forEach((doc) => {
      gear.push(doc.data() as GearItem);
    });
    return gear;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveGearItem(gear: GearItem) {
  const path = `gear_items/${gear.id}`;
  try {
    const docRef = doc(db, "gear_items", gear.id);
    await setDoc(docRef, cleanUndefined(gear));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function removeGearItem(id: string) {
  const path = `gear_items/${id}`;
  try {
    const docRef = doc(db, "gear_items", id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 6. Bookings Service
export async function fetchBookings(): Promise<BookingSubmission[]> {
  const path = "bookings";
  try {
    const colRef = collection(db, "bookings");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const bookings: BookingSubmission[] = [];
    snap.forEach((doc) => {
      bookings.push(doc.data() as BookingSubmission);
    });
    return bookings;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveBooking(booking: BookingSubmission) {
  const docId = booking.id || `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const finalBooking = { 
    ...booking, 
    id: docId,
    createdAt: booking.createdAt || new Date().toISOString()
  };
  const path = `bookings/${docId}`;
  try {
    const docRef = doc(db, "bookings", docId);
    await setDoc(docRef, cleanUndefined(finalBooking));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function removeBooking(id: string) {
  const path = `bookings/${id}`;
  try {
    const docRef = doc(db, "bookings", id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
