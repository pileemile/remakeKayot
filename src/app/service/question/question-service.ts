import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {QuestionCreate} from '../../models/quizzes/quizzes';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public questionAll$ = new BehaviorSubject<QuestionCreate[] | null>(null);

  public async getQuestion() {
    let { data: questions, error } = await supabase
      .from('questions')
      .select('*')
    console.log(questions, 'questions');
    this.questionAll$.next(questions);

  }

}
