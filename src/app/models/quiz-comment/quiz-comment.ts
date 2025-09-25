export interface Comment {
  id: string;
  text: string;
  quiz_id: string;
  userId?: string;
  created_at: Date;
  ranking: number;
}
