import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Answers, QuestionCreate, Quizzes} from '../../models/quizzes/quizzes';
import {TablesInsert} from '../../../environments/supabase';
import {supabase} from '../../../environments/environment';


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
  public answers$ = new BehaviorSubject<Answers[] | null>(null)

  public addQuizz(quiz: Quizzes) {
    this.quiz$.next(quiz);
  }

  async InsertQuizzes(quiz: Quizzes)  {

    const newQuiz: TablesInsert<'quizzes'> = {
      category: this.quiz$.value?.category ?? null,
      title: this.quiz$.value?.title ?? '',
      description: this.quiz$.value?.description ?? null,
      difficulty: this.quiz$.value?.difficulty ?? null,
      created_at: this.quiz$.value?.created_at ?? new Date().toISOString(),
      user_id: '0d67a0d7-140c-4c8d-a2e4-61016720ae3a',
    };

    const { data, error } = await supabase
      .from('quizzes')
      .insert([newQuiz])
      .select();

    if (error) {
      console.error('Erreur lors de l\'insertion :', error);
    } else {
      console.log('Données insérées :', data);
    }
  }

}
