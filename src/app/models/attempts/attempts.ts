import {Quiz} from '../quiz/quiz';

export interface Attempts {
  created_at: string | number | Date
  id?: string
  id_attempts_answers?: string | null
  quiz_id?: string | null
  score?: number | null
  total?: number | null
  user_id?: string | null
  quizzes?: Quiz;
  isCompleted?: boolean
}
