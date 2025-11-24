export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: Date | string | null;
  updated_at: Date | string;
}
