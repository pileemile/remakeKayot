import {QuestionCreate} from '../question/question';
import {Categories} from '../categories/categories';

export interface Quiz {
  [key: string]: string | number | boolean | undefined | null | QuestionCreate[] | Categories;
  id: string;
  user_id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  created_at: string;
  questions: QuestionCreate[]
  category_id: string;
  category?: Categories;
  is_daily_challenge?: boolean;
  valid_until?: string | null;
}

export interface QuizInsert {
  title: string;
  description: string;
  difficulty: Difficulty;
  created_at: string;
  user_id: string;
  category_id: string;
}

export enum Difficulty {
  Facile= "Facile",
  Moyen = "Moyen",
  Difficile = "Difficile",
}


export interface QuizWithStatus extends Quiz {
  questionCount: number;
  isAttempted: boolean;
  isCompleted: boolean;
}






