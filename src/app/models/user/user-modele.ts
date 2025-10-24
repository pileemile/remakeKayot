import {Quiz} from '../quiz/quiz';

export interface  UserModele {
  adress?: string | null
  first_name?: string | null
  id?: number
  last_name?: string | null
  role: RoleEnum
  user_id?: string
  cp: number
  ville: string
  [key: string]: string | number | boolean | undefined | null;
}

export enum RoleEnum {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'
}


export interface UserCompletedQuiz {
  quiz: Quiz[];
}

export interface UserProfile {
  user_id: string;
  avatar_url?: string;
  bio?: string;
  country?: string;
  language?: string;
  theme_preference?: 'light' | 'dark';
  updated_at?: string;
}

