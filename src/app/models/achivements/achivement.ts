export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  criteria: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  obtained_at: string | null;
  metadata: any;
  achievements?: Achievement;
}
