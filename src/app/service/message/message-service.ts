import { Injectable } from '@angular/core';
import {supabase} from '../../../environments/environment';
import {BehaviorSubject, Subject} from 'rxjs';
import {RealtimeChannel} from '@supabase/supabase-js';
import {Conversation, MessageInsert, Message} from '../../models/message/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public messages$ = new BehaviorSubject<Message[]>([]);
  public conversations$ = new BehaviorSubject<Conversation[]>([]);
  public unreadCount$ = new BehaviorSubject<number>(0);
  public newMessage$ = new Subject<Message>();

  private realtimeChannel: RealtimeChannel | null = null;
  private currentUserId: string | null = null;

  constructor() {}

  public async initializeRealtime(userId: string): Promise<void> {
    this.currentUserId = userId;

    if (this.realtimeChannel) {
      await supabase. removeChannel(this.realtimeChannel);
    }

    this. realtimeChannel = supabase
      .channel(`messages:user-${userId}`)
      . on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        async (payload) => {
          console.log('Nouveau message reçu:', payload);
          const newMessage = payload.new as Message;

          this.newMessage$. next(newMessage);

          const currentMessages = this.messages$.value;
          this.messages$.next([...currentMessages, newMessage]);

          await this.updateUnreadCount(userId);

          await this.loadConversations(userId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        async (payload) => {
          console. log(' Message mis à jour:', payload);

          const updatedMessage = payload.new as Message;
          const currentMessages = this.messages$.value;
          const index = currentMessages.findIndex(m => m["id"] === updatedMessage["id"]);

          if (index !== -1) {
            currentMessages[index] = updatedMessage;
            this. messages$.next([...currentMessages]);
          }

          await this.updateUnreadCount(userId);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(' Connecté au realtime pour les messages');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(' Erreur de connexion au realtime');
        }
      });
  }

  public async sendMessage(receiverId: string, content: string): Promise<Message | null> {
    if (!this.currentUserId) {
      console.error('Utilisateur non connecté');
      return null;
    }

    const messageInsert: MessageInsert = {
      sender_id: this.currentUserId,
      receiver_id: receiverId,
      content: content,
      is_read: false,
      sent_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(messageInsert)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      return null;
    }

    const currentMessages = this.messages$.value;
    this.messages$.next([...currentMessages, data]);

    await this.loadConversations(this.currentUserId);

    return data;
  }

  public async loadMessages(userId: string, otherUserId: string): Promise<void> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      . or(`and(sender_id.eq.${userId},receiver_id.eq. ${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('Erreur lors du chargement des messages:', error);
      this.messages$.next([]);
    } else {
      this.messages$.next(data || []);
    }

    await this.markMessagesAsRead(userId, otherUserId);
  }

  public async markMessagesAsRead(userId: string, senderId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      . update({ is_read: true })
      .eq('receiver_id', userId)
      .eq('sender_id', senderId)
      .eq('is_read', false);

    if (error) {
      console.error('Erreur lors du marquage des messages comme lus:', error);
    } else {
      await this.updateUnreadCount(userId);
    }
  }

  private async updateUnreadCount(userId: string): Promise<void> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
    } else {
      this.unreadCount$.next(count || 0);
    }
  }

  public async loadConversations(userId: string): Promise<void> {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      this.conversations$.next([]);
      return;
    }

    const conversationsMap = new Map<string, Conversation>();

    for (const message of messages || []) {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;

      if (!conversationsMap.has(otherUserId)) {
        const { data: userData } = await supabase
          . from('user_roles')
          .select('first_name, last_name')
          .eq('user_id', otherUserId)
          .single();

        const { count } = await supabase
          . from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', otherUserId)
          .eq('receiver_id', userId)
          . eq('is_read', false);

        conversationsMap.set(otherUserId, {
          user_id: otherUserId,
          user_name: `${userData?. first_name || ''} ${userData?.last_name || ''}`. trim() || 'Utilisateur inconnu',
          last_message: message.content,
          last_message_time: message.sent_at,
          unread_count: count || 0,
        });
      }
    }

    this.conversations$.next(Array.from(conversationsMap.values()));
  }

  public async searchUsers(query: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('user_id, first_name, last_name')
      .or(`first_name.ilike.%${query}%,last_name. ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      return [];
    }

    return data || [];
  }

  ngOnDestroy(): void {
    if (this.realtimeChannel) {
      supabase. removeChannel(this.realtimeChannel);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.realtimeChannel) {
      await supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
    this.currentUserId = null;
    this.messages$.next([]);
    this.conversations$. next([]);
    this.unreadCount$.next(0);
  }
}
