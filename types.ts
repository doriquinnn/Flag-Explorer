
export type AppView = 'learn' | 'quiz';

export interface Country {
  name: string;
  code: string;
}

export interface QuizQuestion {
  countryName: string;
  countryCode: string;
  options: string[];
  correctAnswer: string;
}
