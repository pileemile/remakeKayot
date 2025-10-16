export interface LevelUser {
  user_id: string;
  current_xp: number;
  total_xp: number;
  last_update: string;
  current_level: string;
  levels: Level;
}

export interface Level {
  id: string;
  level: number;
  required_xp: number;
  name: string;
  reward: string | null;
  created_at: string;
}
