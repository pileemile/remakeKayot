export interface Quizzes {
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
  "Sport"= "Sport",
  "Culture" = "Culture",
  "Geographie" = "Geographie",
}

export enum Difficulty {
  "Facile"= "Facile",
  "Moyen" = "Moyen",
  "Difficile" = "Difficile",
}
export interface QuestionCreate {
  created_at?: string | null
  id?: string
  quiz_id?: string | null
  text: string
}

export interface Answers {
  question_id: QuestionCreate
  text: string;
  is_correct: boolean;
}
