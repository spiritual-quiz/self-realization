export interface CourseLesson {
  id: string;
  title: { en: string; hi: string };
  duration: string;
  videoUrl: string; // YouTube embed URL
  summary: { en: string; hi: string };
  keyTakeaways: { en: string[]; hi: string[] };
  verseRef?: string;
}

export interface CourseQuizQuestion {
  question: { en: string; hi: string };
  options: { en: string[]; hi: string[] };
  correctIndex: number;
  explanation: { en: string; hi: string };
}

export interface LMSCourse {
  id: string;
  title: { en: string; hi: string };
  desc: { en: string; hi: string };
  level: "Beginner" | "Intermediate" | "Advanced";
  lessonsCount: string;
  duration: string;
  price: string;
  isPaid: boolean;
  instructor: string;
  thumbnail: string;
  mode?: string;
  timing?: string;
  venue?: string;
  roomNumber?: string;
  whatsappGroupUrl?: string;
  lessons: CourseLesson[];
  assessment: CourseQuizQuestion[];
}

export const LMS_COURSES: LMSCourse[] = [];

export function getCourseById(id: string): LMSCourse | undefined {
  // Check if course was deleted by Admin
  if (typeof window !== "undefined") {
    try {
      const deletedList: string[] = JSON.parse(localStorage.getItem("sr_deleted_courses") || "[]");
      if (deletedList.includes(id)) return undefined;

      const customCourses = localStorage.getItem("sr_custom_courses") || localStorage.getItem("sr_lms_courses");
      if (customCourses) {
        const parsed: any[] = JSON.parse(customCourses);
        const match = parsed.find((c) => c.id === id);
        if (match) {
          // Ensure lessons structure exists
          const lessonsList: CourseLesson[] = match.lessonsList || (match.modules ? match.modules.map((m: any, idx: number) => ({
            id: `${match.id}-lesson-${idx + 1}`,
            title: m.title || { en: m.titleEn || `Lesson ${idx + 1}`, hi: m.titleHi || `सत्र ${idx + 1}` },
            duration: m.length || "30 mins",
            videoUrl: m.videoUrl || "https://www.youtube-nocookie.com/embed/fDcfkZ5y6oA",
            summary: {
              en: match.desc?.en || "Systematic exploration of Vedic philosophy, devotional lifestyle, and Bhagavad-gita wisdom.",
              hi: match.desc?.hi || "वैदिक दर्शन, भक्तिमय जीवनशैली और भगवद्गीता के अमर संदेश का व्यवस्थित अध्ययन।"
            },
            keyTakeaways: {
              en: ["Understand the distinction between material body and eternal soul.", "Learn practical devotion in daily work and life."],
              hi: ["शरीर और शाश्वत आत्मा के वास्तविक अंतर को समझें।", "दैनिक जीवन में व्यावहारिक भक्ति का अभ्यास करें।"]
            },
            verseRef: "Bhagavad-gītā"
          })) : [
            {
              id: `${match.id}-lesson-1`,
              title: match.title || { en: "Introduction to Spiritual Science", hi: "आध्यात्मिक विज्ञान की प्रस्तावना" },
              duration: "30 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/fDcfkZ5y6oA",
              summary: { en: "Foundation of spiritual understanding.", hi: "आध्यात्मिक ज्ञान के मूलभूत सिद्धांत।" },
              keyTakeaways: { en: ["Mind control and spiritual focus."], hi: ["मन पर नियंत्रण और आत्म-साक्षात्कार।"] },
              verseRef: "Bhagavad-gītā 2.13"
            }
          ]);

          return {
            id: match.id,
            title: match.title,
            desc: match.desc || { en: "", hi: "" },
            level: match.level || "Beginner",
            lessonsCount: typeof match.lessons === "string" ? match.lessons : `${lessonsList.length} Lessons`,
            duration: match.duration || "4 Hours",
            price: match.price || "Free Access",
            isPaid: match.isPaid || false,
            instructor: match.instructor || "ISKCON NVCC Scholars",
            thumbnail: match.thumbnail || "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png",
            mode: match.mode || "Online & Offline (Hybrid)",
            timing: match.timing || "Every Sunday: 10:00 AM – 11:30 AM IST",
            venue: match.venue || "Sri Sri Radha Vrindavanchandra Mandir",
            roomNumber: match.roomNumber || "Room 108",
            whatsappGroupUrl: match.whatsappGroupUrl || "https://chat.whatsapp.com/SelfRealizationGita",
            lessons: lessonsList,
            assessment: match.assessment || [
              {
                question: {
                  en: "What is the primary foundation of Bhagavad-gītā wisdom?",
                  hi: "श्रीमद्भगवद्गीता के ज्ञान का मूल आधार क्या है?"
                },
                options: {
                  en: ["Physical sensory enjoyment", "We are eternal spiritual souls, distinct from the temporary body", "Blind material speculation", "Abandoning worldly work entirely"],
                  hi: ["शारीरिक इंद्रिय सुख", "हम नश्वर शरीर नहीं, अपितु शाश्वत जीवात्मा हैं", "अंधविश्वास और तर्कहीन कल्पना", "बिना उद्देश्य के कर्म का त्याग"]
                },
                correctIndex: 1,
                explanation: {
                  en: "Lord Kṛṣṇa begins His instruction by explaining the distinction between the mortal body and immortal soul.",
                  hi: "भगवान श्रीकृष्ण ने अपने उपदेश का प्रारंभ देह और देही (आत्मा) के अंतर को समझाकर किया।"
                }
              }
            ]
          };
        }
      }
    } catch (e) {}
  }
  return LMS_COURSES.find((c) => c.id === id);
}
