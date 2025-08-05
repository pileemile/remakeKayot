import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Answers, QuestionCreate} from '../../models/quizzes/quizzes';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  public answersAll$ = new BehaviorSubject<Answers[] |null>(null);
  public answer$ = new BehaviorSubject<Answers[] | null>(null);

  public async getAnswers() {
    let { data: answers, error } = await supabase
      .from('answers')
      .select('*')
    console.log(answers, 'answers')
    this.answersAll$.next(answers);

  }

  public async getAnswersById(id: string | undefined) {
    console.log('id de la question', id)
    let { data: answers, error } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', id)

    this.answer$.next(answers);
    console.log(this.answer$, 'answers dans le service')
  }

}
