import { Injectable } from '@angular/core';
import {supabase} from '../../../environments/environment';
import {Attempts} from '../../models/attempts/attempts';
import {BehaviorSubject} from 'rxjs';
import {Quiz} from '../../models/quiz/quiz';

@Injectable({
  providedIn: 'root'
})
export class AttemptsService {
  public attemptsAllWithUser$ = new BehaviorSubject<Attempts[] | null>(null);
  public attempts: Attempts | null = null

  public async getAttempts(user_id: string | undefined) {

    let { data: attempts, error } = await supabase
      .from('attempts')
      .select('*')
      .eq('user_id', user_id)
    if (error) {
      console.error("erreur sur l'insertion des attempts", error);
    }
    else {
      this.attemptsAllWithUser$.next(attempts);
    }
  }

  public async matchAttemptsQuiz(user_id: string): Promise<void> {
    const { data, error } = await supabase
      .from('attempts')
      .select(`
        id,
        user_id,
        quiz_id,
        score,
        total,
        created_at,
        quizzes (
          id,
          user_id,
          title,
          description,
          category,
          difficulty,
          created_at
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des attempts avec quiz :', error);
      return;
    }

    const formatted: Attempts[] = (data ?? []).map((item: any) => {
      const quizArray = item.quizzes as Quiz[];
      const quiz = quizArray && quizArray.length > 0 ? quizArray[0] : undefined;

      return {
        id: item.id,
        user_id: item.user_id,
        quiz_id: item.quiz_id,
        score: item.score,
        total: item.total,
        created_at: item.created_at,
        quizzes: quiz
      };
    });

    this.attemptsAllWithUser$.next(formatted);
  }
}
