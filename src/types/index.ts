export type Language = 'en' | 'hi';

export interface BilingualText {
  en: string;
  hi: string;
}

export interface UpcomingClass {
  id: string;
  title: BilingualText;
  description: BilingualText;
  instructor: BilingualText;
  date: string;
  time: string;
  venueOrOnline: BilingualText;
  isOnline: boolean;
  isPaid: boolean;
  price?: number;
  capacity?: number;
  registeredCount: number;
}

export interface CoursePreview {
  id: string;
  title: BilingualText;
  description: BilingualText;
  level: BilingualText;
  duration: BilingualText;
  lessonsCount: number;
  isPaid: boolean;
  price?: number;
  thumbnail: string;
  featured?: boolean;
}

export interface QuizPreview {
  id: string;
  title: BilingualText;
  description: BilingualText;
  category: BilingualText;
  questionCount: number;
  points: number;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  thumbnail?: string;
}
