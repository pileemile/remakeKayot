import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../../../environments/environment';
import { Quiz } from '../../models/quiz/quiz';

@Injectable({
  providedIn: 'root'
})
export class DailyChallengeService {
  public todayQuiz$ = new BehaviorSubject<Quiz | null>(null);

  /**
   * Récupérer le quiz quotidien valide pour aujourd'hui
   * @returns Le quiz quotidien ou null s'il n'existe pas
   */
  public async getTodayQuiz(): Promise<Quiz | null> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions(*),
        category:categories!quizzes_category_id_fkey (
          *
        )
      `)
      .eq('is_daily_challenge', true)
      .gte('valid_until', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la récupération du quiz quotidien:', error);
      this.todayQuiz$.next(null);
      return null;
    }

    this.todayQuiz$.next(data);
    return data;
  }

  /**
   * Vérifier si un quiz quotidien existe pour aujourd'hui
   * @returns true si un quiz quotidien valide existe
   */
  public async hasTodayQuiz(): Promise<boolean> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('quizzes')
      .select('id')
      .eq('is_daily_challenge', true)
      .gte('valid_until', now)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la vérification du quiz quotidien:', error);
      return false;
    }

    return !!data;
  }
}
