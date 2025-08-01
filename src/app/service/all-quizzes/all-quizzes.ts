import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Quizzes} from '../../models/quizzes/quizzes';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllQuizzesService {
  public allQuizzes$ = new BehaviorSubject<Quizzes[] |null>(null);


  public async getAllQuizzes() {

    let { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
    this.allQuizzes$.next(quizzes);
  }

}
