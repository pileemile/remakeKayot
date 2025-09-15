import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {QuestionCreate} from '../../models/quizzes/quizzes';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public questionsAll$ = new BehaviorSubject<QuestionCreate[] | null>(null);
  public question$ = new BehaviorSubject<QuestionCreate[] | null>(null);

  public async getAllQuestion() {
    let {data: questions, error} = await supabase
      .from('questions')
      .select('*')
    this.questionsAll$.next(questions);
  }

  public async getAnswersByQuestionId(id: string) {
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
