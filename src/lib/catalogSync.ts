import { db } from "./firebase/client";
import { doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";

export const BROADCAST_CHANNEL_NAME = "sr_catalog_sync";

export function getDeletedCourseIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("sr_deleted_courses") || "[]");
  } catch (e) {
    return [];
  }
}

export function getDeletedQuizIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("sr_deleted_quizzes") || "[]");
  } catch (e) {
    return [];
  }
}

export async function markCourseDeleted(courseId: string) {
  if (typeof window === "undefined") return;
  try {
    const list = getDeletedCourseIds();
    if (!list.includes(courseId)) {
      list.push(courseId);
      localStorage.setItem("sr_deleted_courses", JSON.stringify(list));
    }
    // Also record in Firestore meta so all visitors on all devices respect the deletion
    await setDoc(doc(db, "system", "catalog_meta"), {
      deletedCourses: arrayUnion(courseId),
      coursesCustomized: true,
      lastUpdated: Date.now()
    }, { merge: true });
  } catch (e) {
    console.warn("Notice updating catalog_meta for deleted course:", e);
  }
  broadcastCatalogChange("courses", "delete", courseId);
}

export async function markQuizDeleted(quizId: string) {
  if (typeof window === "undefined") return;
  try {
    const list = getDeletedQuizIds();
    if (!list.includes(quizId)) {
      list.push(quizId);
      localStorage.setItem("sr_deleted_quizzes", JSON.stringify(list));
    }
    // Also record in Firestore meta so all visitors on all devices respect the deletion
    await setDoc(doc(db, "system", "catalog_meta"), {
      deletedQuizzes: arrayUnion(quizId),
      quizzesCustomized: true,
      lastUpdated: Date.now()
    }, { merge: true });
  } catch (e) {
    console.warn("Notice updating catalog_meta for deleted quiz:", e);
  }
  broadcastCatalogChange("quizzes", "delete", quizId);
}

export function broadcastCatalogChange(
  type: "courses" | "quizzes" | "classes",
  action: "save" | "delete" = "save",
  id?: string
) {
  if (typeof window === "undefined") return;

  // 1. Same-window custom event
  try {
    window.dispatchEvent(
      new CustomEvent("sr_catalog_sync", {
        detail: { type, action, id, timestamp: Date.now() }
      })
    );
  } catch (e) {}

  // 2. Cross-tab BroadcastChannel
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type, action, id, timestamp: Date.now() });
      bc.close();
    }
  } catch (e) {}
}

export function subscribeToCatalogSync(callback: (detail?: any) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent;
    callback(custom?.detail);
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (
      e.key === "sr_lms_courses" ||
      e.key === "sr_custom_courses" ||
      e.key === "sr_custom_quizzes" ||
      e.key === "sr_deleted_courses" ||
      e.key === "sr_deleted_quizzes" ||
      e.key === "sr_ongoing_classes"
    ) {
      callback({ key: e.key });
    }
  };

  window.addEventListener("sr_catalog_sync", handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  let bc: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== "undefined") {
    try {
      bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.onmessage = (event) => {
        callback(event.data);
      };
    } catch (e) {}
  }

  return () => {
    window.removeEventListener("sr_catalog_sync", handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
    if (bc) {
      bc.close();
    }
  };
}
