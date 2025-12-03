export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  sent_at: string;
  sender?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  receiver?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  user_id: string;
  user_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  avatar_url?: string;
}

export interface MessageInsert {
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read?: boolean;
  sent_at?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: string;
}

