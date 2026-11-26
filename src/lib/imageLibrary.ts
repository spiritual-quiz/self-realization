export interface ImageAsset {
  id: string;
  name: string; // tag e.g. "krishna", "rama", "vishnu", "temple", "gita", "bhakti-vaibhava"
  title: string;
  url: string;
  category: "Deity" | "Philosophy" | "Temple" | "Course";
  targetType?: "banner" | "question"; // banner (1200x675) or individual question (600x400)
}

export const DEFAULT_IMAGE_LIBRARY: ImageAsset[] = [
  {
    id: "img-krishna",
    name: "krishna",
    title: "Lord Sri Krishna (Partha-sarathi)",
    url: "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png",
    category: "Deity",
    targetType: "question"
  },
  {
    id: "img-rama",
    name: "rama",
    title: "Lord Ramachandra & Sita Lakshman Hanuman",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    category: "Deity",
    targetType: "question"
  },
  {
    id: "img-vishnu",
    name: "vishnu",
    title: "Lord Vishnu & Vaikuntha Abode",
    url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
    category: "Deity",
    targetType: "question"
  },
  {
    id: "img-temple",
    name: "temple",
    title: "Vedic Temple & Lotus Architecture",
    url: "https://www.iskconpune.com/wp-content/uploads/2023/02/radha-vrindavanchandra-1024x683.jpeg",
    category: "Temple",
    targetType: "banner"
  },
  {
    id: "img-gita",
    name: "gita",
    title: "Bhagavad-gita As It Is & Kurukshetra",
    url: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80",
    category: "Philosophy",
    targetType: "banner"
  },
  {
    id: "img-prabhupada",
    name: "prabhupada",
    title: "His Divine Grace A.C. Bhaktivedanta Swami Prabhupada",
    url: "https://www.iskconpune.com/wp-content/uploads/2023/02/srila-prabhupada.jpg",
    category: "Philosophy",
    targetType: "question"
  },
  {
    id: "img-meditation",
    name: "meditation",
    title: "Japa Meditation on Tulasi Beads",
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    category: "Philosophy",
    targetType: "question"
  },
  {
    id: "img-bhakti-vaibhava",
    name: "bhakti-vaibhava",
    title: "Bhakti Vaibhava Srimad Bhagavatam Study Banner",
    url: "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png",
    category: "Course",
    targetType: "banner"
  }
];

export function getStoredImageLibrary(): ImageAsset[] {
  if (typeof window === "undefined") return DEFAULT_IMAGE_LIBRARY;
  try {
    const deletedImageIds: string[] = JSON.parse(localStorage.getItem("sr_deleted_image_ids") || "[]");
    const raw = localStorage.getItem("sr_image_library");
    
    let baseList: ImageAsset[];
    if (raw !== null) {
      // If the admin has saved the image library (even if empty []), strictly respect it!
      const parsed: ImageAsset[] = JSON.parse(raw);
      baseList = Array.isArray(parsed) ? parsed : [];
    } else {
      // First-time visit: initialize from defaults
      baseList = [...DEFAULT_IMAGE_LIBRARY];
      localStorage.setItem("sr_image_library", JSON.stringify(baseList));
    }

    // Filter out ANY deleted image IDs or tag names
    const filtered = baseList.filter(
      img => !deletedImageIds.includes(img.id) && !deletedImageIds.includes(img.name.toLowerCase())
    );
    return filtered;
  } catch (e) {
    return DEFAULT_IMAGE_LIBRARY;
  }
}

export function saveImageToLibrary(asset: ImageAsset): ImageAsset[] {
  if (typeof window === "undefined") return DEFAULT_IMAGE_LIBRARY;
  
  // Un-blacklist if re-uploaded by admin
  const deletedImageIds: string[] = JSON.parse(localStorage.getItem("sr_deleted_image_ids") || "[]");
  const filteredDeleted = deletedImageIds.filter(
    id => id !== asset.id && id !== asset.name.toLowerCase()
  );
  localStorage.setItem("sr_deleted_image_ids", JSON.stringify(filteredDeleted));

  const current = getStoredImageLibrary();
  const existingIdx = current.findIndex(a => a.name.toLowerCase() === asset.name.toLowerCase() || a.id === asset.id);
  let updated: ImageAsset[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = asset;
  } else {
    updated = [asset, ...current];
  }
  localStorage.setItem("sr_image_library", JSON.stringify(updated));
  return updated;
}

export function deleteImageFromLibrary(idOrName: string): ImageAsset[] {
  if (typeof window === "undefined") return DEFAULT_IMAGE_LIBRARY;
  const target = idOrName.trim().toLowerCase();

  // 1. Record in persistent blacklist so page refresh never brings it back
  const deletedImageIds: string[] = JSON.parse(localStorage.getItem("sr_deleted_image_ids") || "[]");
  if (!deletedImageIds.includes(idOrName)) deletedImageIds.push(idOrName);
  if (!deletedImageIds.includes(target)) deletedImageIds.push(target);
  localStorage.setItem("sr_deleted_image_ids", JSON.stringify(deletedImageIds));

  // 2. Remove from active library
  const current = getStoredImageLibrary();
  const updated = current.filter(
    a => a.id !== idOrName && a.name.toLowerCase() !== target
  );
  localStorage.setItem("sr_image_library", JSON.stringify(updated));
  return updated;
}

export function resolveImageUrlByTag(tagName?: string, fallbackUrl?: string): string {
  if (!tagName) return fallbackUrl || DEFAULT_IMAGE_LIBRARY[0].url;
  const clean = tagName.trim().toLowerCase();
  
  // Direct URL provided
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("/") || clean.startsWith("data:")) {
    return tagName.trim();
  }

  // Check if this tag has been permanently deleted
  if (typeof window !== "undefined") {
    try {
      const deletedImageIds: string[] = JSON.parse(localStorage.getItem("sr_deleted_image_ids") || "[]");
      if (deletedImageIds.includes(clean)) {
        return fallbackUrl || "";
      }
    } catch (e) {}
  }

  // Check custom uploaded local images from Admin
  if (typeof window !== "undefined") {
    try {
      const library = getStoredImageLibrary();
      const match = library.find(img => img.name.toLowerCase() === clean);
      if (match) return match.url;
    } catch (e) {}
  }

  // Check defaults if not deleted
  if (typeof window !== "undefined") {
    try {
      const deletedImageIds: string[] = JSON.parse(localStorage.getItem("sr_deleted_image_ids") || "[]");
      if (deletedImageIds.includes(clean)) return fallbackUrl || "";
    } catch (e) {}
  }

  const defMatch = DEFAULT_IMAGE_LIBRARY.find(img => img.name.toLowerCase() === clean);
  if (defMatch) return defMatch.url;

  return fallbackUrl || DEFAULT_IMAGE_LIBRARY[0].url;
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
