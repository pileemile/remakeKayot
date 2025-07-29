import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Answers, QuestionCreate, Quizzes} from '../../models/quizzes/quizzes';

@Injectable({
  providedIn: 'root'
})
export class QuizzesService {

  // constructor() {
  //   this.supabase = createClient(
  //     environment.supabaseUrl,
  //     environment.supabaseKey
  //   );

  public  quiz$ = new BehaviorSubject<Quizzes | null>(null)
  public createQuestion$ = new BehaviorSubject<QuestionCreate[] | null>(null);
  public answers$ = new BehaviorSubject<Answers | null>(null)

  public addQuizz(quizz: Quizzes) {
    this.quiz$.next(quizz);
  }

  public addQuestion(question: QuestionCreate[]): void {
    this.createQuestion$.next(question);
  }


}
