import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {supabase} from '../../../environments/environment';
import {Notification, NotificationMetadata, NotificationType} from '../../models/notification/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifications$ = new BehaviorSubject<Notification[]>([]);
  public notification$ = new BehaviorSubject<Notification | null>(null)

 private readonly _user_id = "22ce5a89-1db2-46e7-a265-c929697ff1d0";

  public async getNotifications(user_id: string | undefined) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error){
      console.error("erreur sur les notifications", error);
    } else {
      this.notifications$.next(data);
    }
  }

  public async addNotification(type: NotificationType, title: string, message: string, metadata: NotificationMetadata = {}) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: this._user_id,
        type: type,
        title: title,
        message: message,
        is_read: false,
        metadata: this.notification$.value?.metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error){
      console.error("erreur lors de l'ajout de la notification", error);
    }
    return data;
  }

  public async deleteNotification(id: string) {
    const {error} = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    if (error) {
      console.error("erreur lors de la suppression de la notification", error);
    }
      await this.getNotifications(this._user_id);
  }

  public async updateNotification(id: string) {
    const {data, error} = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error("erreur lors de la mise à jour de la notification", error);
    } else {
     await this.getNotifications(this._user_id);
     return data;
    }
  }

  public async getNotificationIsNotRead(user_id: string | undefined) {
    const {data, error} = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_read', false)

    if (error) {
      console.error("erreur sur les notifications", error);
    } else {
      this.notifications$.next(data)
    }
  }

  public async createNotification(
    isPassed: boolean,
    percentage: number,
    quiz_id: string | null | undefined,
    quiz_name?: string,
    passing_thresh?: number
  ) {
    const metadata = {
      quiz_id: quiz_id ?? undefined,
      quiz_name: quiz_name,
      percentage: Math.round(percentage)
    };

    if (isPassed) {
      const quizNameSuffix = quiz_name ? ` "${quiz_name}"` : '';
      const message = `Félicitations ! Vous avez réussi le quiz${quizNameSuffix} avec ${Math.round(percentage)}%.`;

      await this.addNotification(
        NotificationType.QuizPassed,
        'Quiz réussi !',
        message,
        metadata
      );
    } else {
      await this.addNotification(
        NotificationType.QuizFailed,
        'Quiz échoué',
        `Vous n'avez pas atteint le score minimum de ${passing_thresh ?? 75}%. Votre score : ${Math.round(percentage)}%. Réessayez !`,
        metadata
      );
    }
  }


}
