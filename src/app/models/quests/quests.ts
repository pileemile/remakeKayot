export interface Quest {
  id: string;
  title: string;
  description: string | null;
  type: QuestType;
  requirements: QuestRequirements;
  rewards: QuestRewards;
  is_active: boolean;
  expires_at: Date | string | null;
  created_at: Date | string;
}

export enum QuestType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  EVENT = 'event'
}

export interface QuestRequirements {
  play_quiz?: number;
  complete_quiz?: number;
  achieve_score?: number;
  [key: string]: number | undefined;
}

export interface QuestRewards {
  xp?: number;
  coins?: number;
  [key: string]: number | undefined;
}

export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  progress: QuestProgress;
  is_completed: boolean;
  completed_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  quest?: Quest;
}

export interface QuestProgress {
  play_quiz?: number;
  complete_quiz?: number;
  achieve_score?: number;
  [key: string]: number | undefined;
}
