export interface ImageAsset {
  id: string;
  name: string; // tag e.g. "krishna", "rama", "vishnu", "temple", "gita", "bhakti-vaibhava"
  title: string;
  url: string;
  category: "Deity" | "Philosophy" | "Temple" | "Course";
}

export const DEFAULT_IMAGE_LIBRARY: ImageAsset[] = [
  {
    id: "img-krishna",
    name: "krishna",
    title: "Lord Sri Krishna (Partha-sarathi)",
    url: "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png",
    category: "Deity"
  },
  {
    id: "img-rama",
    name: "rama",
    title: "Lord Ramachandra & Sita Lakshman Hanuman",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    category: "Deity"
  },
  {
    id: "img-vishnu",
    name: "vishnu",
    title: "Lord Vishnu & Vaikuntha Abode",
    url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
    category: "Deity"
  },
  {
    id: "img-temple",
    name: "temple",
    title: "Vedic Temple & Lotus Architecture",
    url: "https://www.iskconpune.com/wp-content/uploads/2023/02/radha-vrindavanchandra-1024x683.jpeg",
    category: "Temple"
  },
  {
    id: "img-gita",
    name: "gita",
    title: "Bhagavad-gita As It Is & Kurukshetra",
    url: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80",
    category: "Philosophy"
  },
  {
    id: "img-prabhupada",
    name: "prabhupada",
    title: "His Divine Grace A.C. Bhaktivedanta Swami Prabhupada",
    url: "https://www.iskconpune.com/wp-content/uploads/2023/02/srila-prabhupada.jpg",
    category: "Philosophy"
  },
  {
    id: "img-meditation",
    name: "meditation",
    title: "Japa Meditation on Tulasi Beads",
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    category: "Philosophy"
  },
  {
    id: "img-bhakti-vaibhava",
    name: "bhakti-vaibhava",
    title: "Bhakti Vaibhava Srimad Bhagavatam Study",
    url: "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png",
    category: "Course"
  }
];

export function getStoredImageLibrary(): ImageAsset[] {
  if (typeof window === "undefined") return DEFAULT_IMAGE_LIBRARY;
  try {
    const raw = localStorage.getItem("sr_image_library");
    if (!raw) return DEFAULT_IMAGE_LIBRARY;
    const parsed: ImageAsset[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_IMAGE_LIBRARY;
    
    // Merge custom with defaults ensuring unique names
    const merged = [...parsed];
    DEFAULT_IMAGE_LIBRARY.forEach(def => {
      if (!merged.some(m => m.name.toLowerCase() === def.name.toLowerCase())) {
        merged.push(def);
      }
    });
    return merged;
  } catch (e) {
    return DEFAULT_IMAGE_LIBRARY;
  }
}

export function saveImageToLibrary(asset: ImageAsset): ImageAsset[] {
  if (typeof window === "undefined") return DEFAULT_IMAGE_LIBRARY;
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
  const current = getStoredImageLibrary();
  const updated = current.filter(
    a => a.id !== idOrName && a.name.toLowerCase() !== idOrName.toLowerCase()
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

  // Check custom uploaded local images from Admin
  if (typeof window !== "undefined") {
    try {
      const library = getStoredImageLibrary();
      const match = library.find(img => img.name.toLowerCase() === clean);
      if (match) return match.url;
    } catch (e) {}
  }

  // Check defaults
  const defMatch = DEFAULT_IMAGE_LIBRARY.find(img => img.name.toLowerCase() === clean);
  if (defMatch) return defMatch.url;

  return fallbackUrl || DEFAULT_IMAGE_LIBRARY[0].url;
}

/**
 * Automatically resize & convert an image to optimal dimensions (800x500 16:9)
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

        // Draw letterboxed or cropped to maintain aspect ratio
        ctx.fillStyle = "#1E293B"; // Dark slate background fill
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Aspect fit centered
        const hRatio = targetWidth / img.width;
        const vRatio = targetHeight / img.height;
        const ratio = Math.max(hRatio, vRatio); // cover
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
