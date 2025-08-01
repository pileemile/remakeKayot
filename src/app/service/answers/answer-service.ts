import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Answers} from '../../models/quizzes/quizzes';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  public answersAll$ = new BehaviorSubject<Answers[] |null>(null);

  public async getAnswers() {
    let { data: answers, error } = await supabase
      .from('answers')
      .select('*')
    console.log(answers, 'answers')
    this.answersAll$.next(answers);

  }

}
