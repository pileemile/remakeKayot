import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {QuestionCreate, Quizzes} from '../../models/quizzes/quizzes';
import {supabase} from '../../../environments/environment';
import {ButtonEnum} from '../../component/tabs/constants';
import {QuizComment} from '../../models/quiz-comment/quiz-comment';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  public  quiz$ = new BehaviorSubject<Quizzes | null>(null)
  public allQuizs$ = new BehaviorSubject<Quizzes[] |null>(null);
  public quizId: string | null = null;
  public quizzesFromUserComments = new BehaviorSubject<Quizzes[] | null>(null);
  public activeTab: 'search' | 'all' | 'create' | 'filter' |  null = null;
  public pageActive?: ButtonEnum;

  private http = inject(HttpClient);

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
    this.allQuizs$.next(quizzes);

    if (error) {
      console.log("error", error)
    }
  }

  public async getQuizById(id: string ) {
    let { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
      .eq('id', id)
      .single();
    this.quiz$.next(quizzes);

    if (error) {
      console.log("error", error)
    }
  }

  public async fetchQuizzesFromUserComments(userComments: QuizComment[] ) {
    const quizIds  = userComments.map(comment => comment.quiz_id)

    let { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('*')
    .in('id', quizIds)

    if (error) {
      console.log("error", error)
    }
    this.quizzesFromUserComments.next(quizzes);
  }
}
