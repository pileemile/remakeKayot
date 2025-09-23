import { Injectable } from '@angular/core';
import {QuizRating} from '../../models/quiz-rating/quiz-rating';
import {BehaviorSubject} from 'rxjs';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizRatingService {
  public quizRatingAll$ = new BehaviorSubject<QuizRating[] | null>(null);

  public async getQuizRating(quiz_id: string | null) {
    const { data, error } = await supabase
    .from('quiz_ratings')
    .select('*')
    .eq('quiz_id', quiz_id)
    if (error) {
      console.log("erreur des quiz rating", error);
    }
    else {
      this.quizRatingAll$.next(data);
    }
  }
}
