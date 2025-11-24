import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../../../environments/environment';
import { UserStreak } from '../../models/streak/streaks';

@Injectable({
  providedIn: 'root'
})
export class StreaksService {
  public userStreak$ = new BehaviorSubject<UserStreak | null>(null);

  public async getUserStreak(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la récupération du streak:', error);
      this.userStreak$.next(null);
    } else {
      this.userStreak$.next(data);
    }
  }

  public async initializeStreak(userId: string): Promise<UserStreak | null> {
    const { data, error } = await supabase
      .from('user_streaks')
      .insert({
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'initialisation du streak:', error);
      return null;
    }

    this.userStreak$.next(data);
    return data;
  }

  public async updateStreak(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const currentStreak = this.userStreak$.value;

    if (!currentStreak) {
      await this.initializeStreak(userId);
      return;
    }

    const lastActivityDate = currentStreak.last_activity_date
      ? new Date(currentStreak.last_activity_date).toISOString().split('T')[0]
      : null;

    if (lastActivityDate === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newCurrentStreak: number;

    if (lastActivityDate === yesterdayStr) {
      newCurrentStreak = currentStreak.current_streak + 1;
    } else {
      newCurrentStreak = 1;
    }

    const newLongestStreak = Math.max(newCurrentStreak, currentStreak.longest_streak);

    const { data, error } = await supabase
      .from('user_streaks')
      .update({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_activity_date: today,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du streak:', error);
    } else {
      this.userStreak$.next(data);
    }
  }

  public async resetStreak(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('user_streaks')
      .update({
        current_streak: 0,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la réinitialisation du streak:', error);
    } else {
      this.userStreak$.next(data);
    }
  }
}
