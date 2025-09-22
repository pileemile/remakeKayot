export interface Comment {
  id: string;
  text: string;
  quiz_id: string;
  userId?: string;
  createdAt: Date;
}

export interface QuizCommentCreate {
  quiz_id: string;
  user_id: string;
  text: string;
}
