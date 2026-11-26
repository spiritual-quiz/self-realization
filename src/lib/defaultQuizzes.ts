import { ParsedQuizQuestion, parseCSVToQuestions, SAMPLE_CSV_CONTENT } from "./csvQuizHelper";

export interface SystemQuiz {
  id: string;
  title: { en: string; hi: string };
  category: string;
  timerSeconds: number;
  bgMusicUrl: string;
  bgMusicVolume: number;
  correctSoundUrl: string;
  wrongSoundUrl: string;
  questions: ParsedQuizQuestion[];
}

const sampleParsed = parseCSVToQuestions(SAMPLE_CSV_CONTENT).questions;

export const DEFAULT_SYSTEM_QUIZZES: SystemQuiz[] = [
  {
    id: "bg-overview",
    title: {
      en: "Bhagavad-gītā Wisdom Challenge",
      hi: "श्रीमद्भगवद्गीता ज्ञान प्रश्नोत्तरी"
    },
    category: "Bhagavad-gītā",
    timerSeconds: 10,
    bgMusicUrl: "/audio/bg-music.mp3",
    bgMusicVolume: 0.35,
    correctSoundUrl: "/audio/correct.mp3",
    wrongSoundUrl: "/audio/wrong.mp3",
    questions: sampleParsed
  },
  {
    id: "krishna-philosophy",
    title: {
      en: "Krishna Katha & Vaishnava Philosophy",
      hi: "कृष्ण कथा एवं वैष्णव दर्शन प्रश्नोत्तरी"
    },
    category: "Philosophy",
    timerSeconds: 10,
    bgMusicUrl: "/audio/bg-music.mp3",
    bgMusicVolume: 0.35,
    correctSoundUrl: "/audio/correct.mp3",
    wrongSoundUrl: "/audio/wrong.mp3",
    questions: sampleParsed.slice(0, 5)
  },
  {
    id: "temple-rituals",
    title: {
      en: "Vedic Culture & Temple Traditions",
      hi: "वैदिक संस्कृति एवं मंदिर परंपराएं"
    },
    category: "Culture",
    timerSeconds: 10,
    bgMusicUrl: "/audio/bg-music.mp3",
    bgMusicVolume: 0.35,
    correctSoundUrl: "/audio/correct.mp3",
    wrongSoundUrl: "/audio/wrong.mp3",
    questions: sampleParsed.slice(4, 9)
  }
];
