import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {QuestionCreate} from '../../models/quiz/quiz';
import {supabase} from '../../../environments/environment';
import {Answers} from '../../models/answer/answer';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public question$ = new BehaviorSubject<QuestionCreate[] | null>(null);

  public async fetchQuestionsWithAnswersByQuizId(id: string) {
    let {data: questions , error} = await supabase
      .from('questions')
      .select(
        '*, answers(*)'
      )
      .eq('quiz_id', id)


    if (error) {
      console.error('Erreur lors de la récupération de la question:', error);

    }
    if (questions) {
      this.question$.next(questions);
    }
  }



}
