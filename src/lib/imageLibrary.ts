import { db } from "./firebase/client";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

export interface ImageAsset {
  id: string;
  name: string; // tag e.g. "krishna", "rama", "vishnu", "temple", "gita", "bhakti-vaibhava"
  title: string;
  url: string;
  category: "Deity" | "Philosophy" | "Temple" | "Course";
  targetType?: "banner" | "question"; // banner (1200x675) or individual question (600x400)
}

// Zero hardcoded images: 100% database-driven from Firestore
export const DEFAULT_IMAGE_LIBRARY: ImageAsset[] = [];

export function getStoredImageLibrary(): ImageAsset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("sr_image_library");
    if (raw !== null) {
      const parsed: ImageAsset[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (e) {
    return [];
  }
}

export async function fetchImageLibraryFromFirestore(): Promise<ImageAsset[]> {
  try {
    const snap = await getDocs(collection(db, "images"));
    const list: ImageAsset[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({ id: d.id, ...data } as ImageAsset);
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("sr_image_library", JSON.stringify(list));
    }
    return list;
  } catch (e) {
    console.warn("Could not fetch image library from Firestore:", e);
    return getStoredImageLibrary();
  }
}

export async function saveImageToLibrary(asset: ImageAsset): Promise<ImageAsset[]> {
  const current = getStoredImageLibrary();
  const existingIdx = current.findIndex(a => a.name.toLowerCase() === asset.name.toLowerCase() || a.id === asset.id);
  let updated: ImageAsset[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = asset;
  } else {
    updated = [asset, ...current];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("sr_image_library", JSON.stringify(updated));
  }

  // Persist directly to Firestore cloud database
  try {
    await setDoc(doc(db, "images", asset.id), asset);
  } catch (e) {
    console.warn("Could not save image to Firestore:", e);
  }

  return updated;
}

export async function deleteImageFromLibrary(idOrName: string): Promise<ImageAsset[]> {
  const target = idOrName.trim().toLowerCase();

  // 1. Remove from active library
  const current = getStoredImageLibrary();
  const targetAsset = current.find(a => a.id === idOrName || a.name.toLowerCase() === target);
  const updated = current.filter(
    a => a.id !== idOrName && a.name.toLowerCase() !== target
  );

  if (typeof window !== "undefined") {
    localStorage.setItem("sr_image_library", JSON.stringify(updated));
  }

  // 2. Permanently delete from Firestore database
  try {
    const docId = targetAsset?.id || idOrName;
    await deleteDoc(doc(db, "images", docId));
  } catch (e) {
    console.warn("Could not delete image from Firestore:", e);
  }

  return updated;
}

export function resolveImageUrlByTag(tagName?: string, fallbackUrl?: string): string {
  const DEFAULT_FALLBACK = "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png";
  if (!tagName) return fallbackUrl || DEFAULT_FALLBACK;
  const clean = tagName.trim().toLowerCase();
  
  // Direct URL provided
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("/") || clean.startsWith("data:")) {
    return tagName.trim();
  }

  // Check stored active images from database
  if (typeof window !== "undefined") {
    try {
      const library = getStoredImageLibrary();
      const match = library.find(img => img.name.toLowerCase() === clean || img.id === clean);
      if (match) return match.url;
    } catch (e) {}
  }

  return fallbackUrl || DEFAULT_FALLBACK;
}

/**
 * Automatically resize & convert an image to optimal dimensions
 * For Banners: 1200 x 675 (16:9)
 * For Question Illustrations: 600 x 400 (3:2)
 */
export async function scaleAndOptimizeImageFile(
  file: File, 
  targetWidth = 800, 
  targetHeight = 500,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Fill background
        ctx.fillStyle = "#1E293B";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Aspect fit / cover
        const hRatio = targetWidth / img.width;
        const vRatio = targetHeight / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (targetWidth - img.width * ratio) / 2;
        const centerShiftY = (targetHeight - img.height * ratio) / 2;

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShiftX,
          centerShiftY,
          img.width * ratio,
          img.height * ratio
        );

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function scaleBannerImage(file: File): Promise<string> {
  return scaleAndOptimizeImageFile(file, 1200, 675, 0.88);
}

export async function scaleQuestionImage(file: File): Promise<string> {
  return scaleAndOptimizeImageFile(file, 600, 400, 0.85);
}
