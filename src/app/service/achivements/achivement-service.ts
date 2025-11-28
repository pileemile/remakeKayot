import { Injectable } from '@angular/core';
import {supabase} from '../../../environments/environment';
import {Achievement, UserAchievement} from '../../models/achivements/achivement';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  public userAchievements$ = new BehaviorSubject<UserAchievement[]>([]);
  public allAchievements$ = new BehaviorSubject<Achievement[]>([]);

  public async getUserAchievements(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      . eq('user_id', userId)
      .order('obtained_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des achievements:', error);
      this.userAchievements$.next([]);
    } else {
      this.userAchievements$.next(data || []);
    }
  }

  public async getAllAchievements(): Promise<void> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      . eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des achievements:', error);
      this. allAchievements$.next([]);
    } else {
      this.allAchievements$. next(data || []);
    }
  }

  public async unlockAchievement(userId: string, achievementId: string, metadata?: any): Promise<void> {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        obtained_at: new Date().toISOString(),
        metadata: metadata || null
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors du déblocage de l\'achievement:', error);
    } else {
      await this.getUserAchievements(userId);
    }
  }

  public hasAchievement(achievementId: string): boolean {
    return this.userAchievements$.value.some(
      ua => ua.achievement_id === achievementId
    );
  }

  public getCompletionPercentage(): number {
    const total = this.allAchievements$.value.length;
    const obtained = this.userAchievements$.value.length;

    if (total === 0) return 0;
    return Math.round((obtained / total) * 100);
  }
}
