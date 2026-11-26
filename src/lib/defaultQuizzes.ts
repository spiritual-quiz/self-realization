import { ParsedQuizQuestion } from "./csvQuizHelper";

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

// Zero hardcoded quizzes: 100% database-driven from Firestore
export const DEFAULT_SYSTEM_QUIZZES: SystemQuiz[] = [];
