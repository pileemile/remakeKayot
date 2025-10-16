export interface LevelUser {
  current_level: string;
  current_xp: number;
  last_updated: string;
  total_xp: number;
  user_id: string;
  levels: Level;
}

export interface Level {
  level: number;
  required_xp: number;
  name: string;
  reward: string;
}
