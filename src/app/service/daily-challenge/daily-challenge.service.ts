import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase, environment } from '../../../environments/environment';
import { Quiz } from '../../models/quiz/quiz';

interface CreateDailyQuizResponse {
  success: boolean;
  quizId?: string;
  title?: string;
  questionsCount?: number;
  message?: string;
  error?: string;
}

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

  /**
   * Créer manuellement le quiz quotidien pour aujourd'hui
   * Appelle la fonction Edge Supabase pour créer le quiz
   * @returns Le résultat de la création
   */
  public async createTodayQuiz(): Promise<CreateDailyQuizResponse> {
    try {
      const response = await fetch(
        `${environment.supabaseUrl}/functions/v1/create-daily-quiz`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${environment.supabaseKey}`,
          },
        }
      );

      const result: CreateDailyQuizResponse = await response.json();

      if (result.success) {
        // Rafraîchir le quiz du jour après la création
        await this.getTodayQuiz();
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la création du quiz quotidien:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }
}
