import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {QuestionCreate, Quizzes} from '../../models/quizzes/quizzes';
import {TablesInsert} from '../../../environments/supabase';
import {supabase} from '../../../environments/environment';
import {Answers} from '../../models/answer/answer';
import {ButtonEnum} from '../../component/tabs/constants';


@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  public  quiz$ = new BehaviorSubject<Quizzes | null>(null)
  public createQuestion$ = new BehaviorSubject<QuestionCreate[] | null>(null);
  public answers$ = new BehaviorSubject<Answers[] | null>(null)
  public allQuizzes$ = new BehaviorSubject<Quizzes[] |null>(null);
  public quizzesId$ = new BehaviorSubject<Quizzes | null>(null);
  public activeTab: 'search' | 'all' | 'create' | 'filter' |  null = null;
  public pageActive?: ButtonEnum;

  public async InsertQuizzes(quiz: Quizzes)  {

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
      if (data && data[0]) {
        this.quiz$.next(data[0] as Quizzes);
      }
      return data?.[0]?.id;
    }
  }

  public async InsertQuestion(question: QuestionCreate[]) {
    const questionInsert = question.map(questions => ({
      created_at: questions.created_at ?? new Date().toISOString(),
      text: questions.text ?? '',
      quiz_id: this.quiz$.value?.id ?? null,
    }));

    const { data, error } = await supabase
      .from('questions')
      .insert(
        questionInsert
      )
      .select()

    if (error){
      console.log("erreur sur l'insertion des questions", error);
    } else {
      if (data) {
        this.createQuestion$.next(data);
      }
    }
  }

  public async InsertAnswers(answers: Answers[]) {
    const answersInsert = answers.map(answer => ({
      is_correct: answer.is_correct,
      text: answer.text,
      question_id: answer.question_id,
    }));

    const { data, error } = await supabase
      .from('answers')
      .insert(answersInsert)
      .select()

    if (error) {
      console.log("erreur sur l'insertion des answers", error);
    } else {
    this.answers$.next(data);
    }
  }

  public async getAllQuizzes() {

    let { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
    this.allQuizzes$.next(quizzes);

    if (error) {
      console.log("error", error)
    }
  }

  public async getQuizzesById(id: string) {
    let { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
      .eq('id', id)
      .single();
    this.quizzesId$.next(quizzes);

    if (error) {
      console.log("error", error)
    }
  }

}
