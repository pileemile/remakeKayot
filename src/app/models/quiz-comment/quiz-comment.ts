export interface Comment {
  id: string;
  text: string;
  quiz_id: string;
  userId?: string;
  createdAt: Date;
  ranking: number;
}
