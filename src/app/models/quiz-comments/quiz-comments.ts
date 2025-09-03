export interface QuizComment {
  id: string;
  quiz_id: string;
  user_id: string;
  text: string;
  created_at: string;
}

export interface QuizCommentCreate {
  quiz_id: string;
  user_id: string;
  text: string;
}