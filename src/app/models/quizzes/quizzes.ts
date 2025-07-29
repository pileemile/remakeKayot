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
  "Géographie" = "Géographie",
}

export enum Difficulty {
  "Facile"= "Facile",
  "Moyen" = "Moyen",
  "Difficile" = "Difficile",
}
export interface QuestionCreate {
  id: string;
  quiz_id: Quizzes;
  text: string;
  created_at: string;
}

export interface Answers {
  question_id: QuestionCreate
  text: string;
  is_correct: boolean;
}
