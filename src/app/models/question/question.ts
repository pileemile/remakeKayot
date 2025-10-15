import {Answers} from '../answer/answer';

export interface QuestionCreate {
  answers: Answers[]
  created_at?: string
  id: string
  quiz_id?: string
  text: string
}
