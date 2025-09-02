import {Answers} from '../answer/answer';

export interface Quizzes {
  [key: string]: string | number | boolean | undefined | null | QuestionCreate[];
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  created_at: string;
  question: QuestionCreate[]
}

export enum Category {
  Sport = "Sport",
  Culture = "Culture",
  Geographie = "Geographie",
}

export enum Difficulty {
  Facile= "Facile",
  Moyen = "Moyen",
  Difficile = "Difficile",
}

export const AllEnumQuizz = {
  Category,
  Difficulty,
} as const;

export interface QuestionCreate {
  answers: Answers[]
  created_at?: string
  id: string
  quiz_id?: string
  text: string
}





