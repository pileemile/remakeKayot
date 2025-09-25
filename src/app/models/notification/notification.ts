export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  metadata?: NotificationMetadata | null;
  created_at: Date;
  updated_at: Date;
}

export enum NotificationType {
  QuizCompleted = 'quiz_completed',
  QuizPassed = 'quiz_passed',
  QuizFailed = 'quiz_failed',
  Achievement = 'achievement',
  SystemAnnouncement = 'system_announcement',
  Reminder = 'reminder'
}

export interface NotificationMetadata {
  quizId?: string;
  quizTitle?: string;
  score?: number;
  achievementId?: string;
  achievementTitle?: string;
  [key: string]: string | number | Date | boolean | undefined;
}
