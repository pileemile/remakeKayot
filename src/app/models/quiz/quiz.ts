import {Answers} from '../answer/answer';

export interface Quiz {
  [key: string]: string | number | boolean | undefined | null | QuestionCreate[];
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  created_at: string;
  questions: QuestionCreate[]
}

export enum Category {
  Sport = "Sport",
  Culture = "Culture",
  Geographie = "Géographie",
}

export enum Difficulty {
  Facile= "Facile",
  Moyen = "Moyen",
  Difficile = "Difficile",
}

export interface QuestionCreate {
  answers: Answers[]
  created_at?: string
  id: string
  quiz_id?: string
  text: string
}





