import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {QuestionCreate, Quizzes} from '../../models/quizzes/quizzes';
import {TablesInsert} from '../../../environments/supabase';
import {environment, supabase} from '../../../environments/environment';
import {Answers} from '../../models/answer/answer';
import {ButtonEnum} from '../../component/tabs/constants';
import {QuizComments} from '../../component/quiz/quiz-comments/quiz-comments';
import {QuizComment} from '../../models/quiz-comment/quiz-comment';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  public  quiz$ = new BehaviorSubject<Quizzes | null>(null)
  public answers$ = new BehaviorSubject<Answers[] | null>(null)
  public allQuizzes$ = new BehaviorSubject<Quizzes[] |null>(null);
  public quizzesId$ = new BehaviorSubject<Quizzes | null>(null);
  public quizzesFilterByComment$ = new BehaviorSubject<Quizzes[] | null>(null);
  public activeTab: 'search' | 'all' | 'create' | 'filter' |  null = null;
  public pageActive?: ButtonEnum;

  private http = inject(HttpClient);

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

  public async insertFullQuiz(quiz: Quizzes, questions: QuestionCreate[]) {
    const quizInsert: Partial<Quizzes> = {
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      created_at: quiz.created_at ?? new Date().toISOString(),
      user_id: quiz.user_id
    };

    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert([quizInsert])
      .select();

    if (quizError || !quizData?.[0]) throw quizError;

    const quizId = quizData[0].id;

    const questionInsert = questions.map(q => ({
      text: q.text,
      created_at: q.created_at ?? new Date().toISOString(),
      quiz_id: quizId
    }));

    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .insert(questionInsert)
      .select();

    if (questionError) throw questionError;

    const answersInsert: any[] = [];
    questionData.forEach((q, index) => {
      questions[index].answers?.forEach(a => {
        answersInsert.push({
          question_id: q.id,
          text: a.text,
          is_correct: a.is_correct
        });
      });
    });

    const { data: answersData, error: answersError } = await supabase
      .from('answers')
      .insert(answersInsert)
      .select();

    if (answersError) throw answersError;

    return { quiz: quizData[0], questions: questionData, answers: answersData };
  }



  public async getAllQuizzes() {

    let { data: quizzes, error } = await supabase
      .from('quizzes, questions(*)')
      .select('*')
    this.allQuizzes$.next(quizzes);

    if (error) {
      console.log("error", error)
    }
  }

  public async getAllQuizzesRest() {
    try {
      const data: Quizzes[] | undefined = await this.http.get<Quizzes[]>(`${environment.supabaseUrl}/rest/v1/quizzes`).toPromise();
      console.log('data', data);
      return data || [];
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  public async getQuizzesById(id: string ) {
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


  public async filterQuizzesByQuizId(quiz_id: QuizComment[] ) {
    const quiz_id_array = quiz_id.map(quiz => quiz.quiz_id)

    let { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('*')
    .in('id', quiz_id_array)

    if (error) {
      console.log("error", error)
    }
    this.quizzesFilterByComment$.next(quizzes);
  }
}
