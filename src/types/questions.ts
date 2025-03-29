export interface Question {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option (0-based)
}

export type Questions = Question[];

export interface QuestionsWrapper {
questions: Questions;
}