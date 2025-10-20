import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../../../environments/environment';
import { Level, LevelUser } from '../../models/level/level';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  public userLevel$ = new BehaviorSubject<LevelUser | null>(null);
  public levels$ = new BehaviorSubject<Level[] | []>([]);

  public async getUserLevel(user_id: string): Promise<void> {
    const { data, error } = await supabase
      .from('user_levels')
      .select('*, levels(*)')
      .eq('user_id', user_id)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du niveau de l'utilisateur", error);
      this.userLevel$.next(null);
    } else {
      this.userLevel$.next(data);
    }
  }

  public async getAllLevels(): Promise<void> {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('level', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des niveaux", error);
      this.levels$.next([]);
    } else {
      this.levels$.next(data || []);
    }
  }

  public getXpRestantPourNiveau(targetLevelId: string): number {
    const userLevel = this.userLevel$.value;
    const levels = this.levels$.value;

    if (!userLevel || !levels || levels.length === 0) {
      return 0;
    }

    const targetLevel = levels.find((level: Level) => level.id === targetLevelId);
    if (!targetLevel) {
      return 0;
    }

    return targetLevel.required_xp - userLevel.current_xp;
  }

  public getProgressToNextLevel(): number {
    const userLevel = this.userLevel$.value;
    const levels = this.levels$.value;

    if (!userLevel || !levels || levels.length === 0) {
      return 0;
    }

    const currentLevel = levels.find((level: Level) => level.id === userLevel.current_level);
    if (!currentLevel) {
      return 0;
    }

    const nextLevel = levels.find((level: Level) => level.level === currentLevel.level + 1);
    if (!nextLevel) {
      return 100;
    }

    const xpEarnedInCurrentLevel = userLevel.current_xp - currentLevel.required_xp;
    const xpNeededForNextLevel = nextLevel.required_xp - currentLevel.required_xp;

    return Math.min(100, (xpEarnedInCurrentLevel / xpNeededForNextLevel) * 100);
  }

  public getGlobalProgress(): number {
    const userLevel = this.userLevel$.value;
    const levels = this.levels$.value;

    if (!userLevel || !levels || levels.length === 0) {
      return 0;
    }

    const maxLevel = levels[levels.length - 1];
    if (!maxLevel) {
      return 0;
    }

    return Math.min(100, (userLevel.current_xp / maxLevel.required_xp) * 100);
  }
  public getProgressTooltip(): string {
    const userLevel = this.userLevel$.value;
    const levels = this.levels$.value;

    if (!userLevel || !levels || levels.length === 0) {
      return "Données non disponibles";
    }

    const currentLevel = levels.find((level: Level) => level.id === userLevel.current_level);
    const nextLevel = levels.find((level: Level) => level.level === currentLevel!.level + 1);

    if (!currentLevel || !nextLevel) {
      return `Niveau max atteint !`;
    }

    const xpRestant = nextLevel.required_xp - userLevel.current_xp;
    return `
      Niveau actuel : ${currentLevel.level} (${currentLevel.name})
      XP actuel : ${userLevel.current_xp}
      XP restant pour le niveau ${nextLevel.level} : ${xpRestant}
    `;
  }

  public getLevelsSupérieurs(): Level[] {
    const userLevel = this.userLevel$.value;
    const levels = this.levels$.value;

    if (!userLevel || !levels || levels.length === 0) {
      return [];
    }

    const currentLevel = levels.find((level: Level) => level.id === userLevel.current_level);
    if (!currentLevel) {
      return [];
    }

    return levels.filter((level: Level) => level.level > currentLevel.level);
  }

  async updateUserLevelIfNeeded(userId: string): Promise<void> {
    const { data: userData, error: userError } = await supabase
      .from('user_levels')
      .select('current_xp, current_level')
      .eq('user_id', userId)
      .single();

    if (userError || !userData) {
      console.error('❌ Erreur lors de la récupération du niveau utilisateur :', userError);
      return;
    }

    const { current_xp, current_level } = userData;

    // 🔍 Récupère les niveaux disponibles
    const { data: levels, error: levelError } = await supabase
      .from('levels')
      .select('*')
      .order('required_xp', { ascending: true });

    if (levelError || !levels) {
      console.error('❌ Erreur lors de la récupération des niveaux :', levelError);
      return;
    }

    // 🔎 Trouve le niveau actuel et le prochain
    const currentLevelIndex = levels.findIndex(l => l.id === current_level);
    const nextLevel = levels[currentLevelIndex + 1];

    if (!nextLevel) {
      console.log('🏆 Niveau maximum atteint');
      return;
    }

    const xpNeeded = nextLevel.required_xp - current_xp;

    if (xpNeeded <= 0) {
      console.log(`🎉 L'utilisateur ${userId} passe au niveau ${nextLevel.name} !`);

      await supabase
        .from('user_levels')
        .update({ current_level: nextLevel.id })
        .eq('user_id', userId);
    } else {
      console.log(
        `ℹ️ Niveau actuel : ${levels[currentLevelIndex].name} (${levels[currentLevelIndex].id}) | ` +
        `XP actuel : ${current_xp} | XP restant pour ${nextLevel.name} : ${xpNeeded}`
      );
    }
  }
}
