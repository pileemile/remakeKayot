import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../../../environments/environment';
import { Quest, UserQuest, QuestType } from '../../models/quests/quests';

@Injectable({
  providedIn: 'root'
})
export class QuestsService {
  public activeQuests$ = new BehaviorSubject<Quest[]>([]);
  public userQuests$ = new BehaviorSubject<UserQuest[]>([]);
  public completedQuests$ = new BehaviorSubject<UserQuest[]>([]);

  public async getActiveQuests(type?: QuestType): Promise<void> {
    let query = supabase
      .from('quests')
      .select('*')
      .eq('is_active', true);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des quêtes actives:', error);
      this.activeQuests$.next([]);
    } else {
      this.activeQuests$.next(data || []);
    }
  }

  public async getUserQuests(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('user_quests')
      .select('*, quest:quests(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des quêtes utilisateur:', error);
      this.userQuests$.next([]);
    } else {
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        quest: Array.isArray(item.quest) ? item.quest[0] : item.quest
      }));

      this.userQuests$.next(formattedData);

      const completed = formattedData.filter((q: UserQuest) => q.is_completed);
      this.completedQuests$.next(completed);
    }
  }

  public async assignQuestToUser(userId: string, questId: string): Promise<UserQuest | null> {
    const { data: existingQuest } = await supabase
      .from('user_quests')
      .select('*')
      .eq('user_id', userId)
      .eq('quest_id', questId)
      .eq('is_completed', false)
      .maybeSingle();

    if (existingQuest) {
      return existingQuest;
    }

    const { data, error } = await supabase
      .from('user_quests')
      .insert({
        user_id: userId,
        quest_id: questId,
        progress: {},
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'assignation de la quête:', error);
      return null;
    }

    return data;
  }

  public async updateQuestProgress(
    userQuestId: string,
    progressKey: string,
    incrementValue: number = 1
  ): Promise<void> {
    const userQuest = this.userQuests$.value.find(q => q.id === userQuestId);

    if (!userQuest || userQuest.is_completed) {
      return;
    }

    const currentProgress = userQuest.progress[progressKey] || 0;
    const newProgress = {
      ...userQuest.progress,
      [progressKey]: currentProgress + incrementValue
    };

    const requirement = userQuest.quest?.requirements[progressKey];
    const currentValue = newProgress[progressKey];
    const isCompleted = requirement && currentValue !== undefined ? currentValue >= requirement : false;

    const updateData: any = {
      progress: newProgress,
      updated_at: new Date().toISOString()
    };

    if (isCompleted) {
      updateData.is_completed = true;
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('user_quests')
      .update(updateData)
      .eq('id', userQuestId);

    if (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
    } else {
      await this.getUserQuests(userQuest.user_id);

      if (isCompleted && userQuest.quest?.rewards) {
        await this.grantRewards(userQuest.user_id, userQuest.quest.rewards);
      }
    }
  }

  private async grantRewards(userId: string, rewards: any): Promise<void> {
    if (rewards.xp) {
      const { data: currentLevel } = await supabase
        .from('user_levels')
        .select('current_xp, total_xp')
        .eq('user_id', userId)
        .single();

      if (currentLevel) {
        await supabase
          .from('user_levels')
          .update({
            current_xp: currentLevel.current_xp + rewards.xp,
            total_xp: currentLevel.total_xp + rewards.xp,
            last_update: new Date().toISOString()
          })
          .eq('user_id', userId);
      }
    }
  }

  public async createQuest(quest: Omit<Quest, 'id' | 'created_at'>): Promise<Quest | null> {
    const { data, error } = await supabase
      .from('quests')
      .insert({
        title: quest.title,
        description: quest.description,
        type: quest.type,
        requirements: quest.requirements,
        rewards: quest.rewards,
        is_active: quest.is_active,
        expires_at: quest.expires_at,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la quête:', error);
      return null;
    }

    return data;
  }

  public async deactivateQuest(questId: string): Promise<void> {
    const { error } = await supabase
      .from('quests')
      .update({ is_active: false })
      .eq('id', questId);

    if (error) {
      console.error('Erreur lors de la désactivation de la quête:', error);
    }
  }

  public getQuestProgress(userQuest: UserQuest): number {
    if (!userQuest.quest) return 0;

    const requirements = userQuest.quest.requirements;
    const progress = userQuest.progress;

    const requirementKeys = Object.keys(requirements);
    if (requirementKeys.length === 0) return 0;

    const key = requirementKeys[0];
    const required = requirements[key] || 1;
    const current = progress[key] || 0;

    return Math.min(100, (current / required) * 100);
  }
}
