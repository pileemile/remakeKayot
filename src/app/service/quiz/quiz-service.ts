import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {QuestionCreate, Quiz} from '../../models/quiz/quiz';
import {supabase} from '../../../environments/environment';
import {ButtonEnum} from '../../component/tabs/constants';
import {Comment} from '../../models/quiz-comment/quiz-comment';
import {Answers} from '../../models/answer/answer';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  public  quiz$ = new BehaviorSubject<Quiz | null>(null)
  public allQuizs$ = new BehaviorSubject<Quiz[] |null>(null);
  public quizId: string | null = null;
  public quizFromUserComments = new BehaviorSubject<Quiz[] | null>(null);
  public activeTab: 'search' | 'all' | 'create' | 'filter' |  null = null;
  public pageActive?: ButtonEnum;


  public async insertFullQuiz(quiz: Quiz, questions: QuestionCreate[]) {
    const quizInsert: Partial<Quiz> = {
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

    const answersInsert: Answers[] = [];
    for (const [index, q] of questionData.entries()) {
      const answers = questions[index].answers;
      if (answers) {
        for (const a of answers) {
          answersInsert.push({
            question_id: q.id,
            text: a.text,
            is_correct: a.is_correct
          });
        }
      }
    }

    const { data: answersData, error: answersError } = await supabase
      .from('answers')
      .insert(answersInsert)
      .select();

    if (answersError) throw answersError;

    return { quiz: quizData[0], questions: questionData, answers: answersData };
  }

  public async getAllQuiz() {

    let { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
    this.allQuizs$.next(quiz);

    if (error) {
      console.error("error", error)
    }
  }

  public async getQuizById(id: string ) {
    let { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error("error", error);
      throw error;
    }
    this.quiz$.next(quiz);
    return quiz;

  }

  public async getAllQuizFromQuizIdFromComment(userComments: Comment[] ) {
    const quizId  = userComments.map(comment => comment.quiz_id)
    let { data: quiz, error } = await supabase
    .from('quizzes')
    .select('*')
    .in('id', quizId)

    if (error) {
      console.error("error", error)
    }
    this.quizFromUserComments.next(quiz);
  }
}
