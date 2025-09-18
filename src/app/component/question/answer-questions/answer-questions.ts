import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../../service/question/question-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {Timer} from '../../timer/timer';
import {Category, QuestionCreate, Quizzes} from '../../../models/quizzes/quizzes';
import {NgClass} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Answers} from '../../../models/answer/answer';
import {AttemptsAnswersService} from '../../../service/attempts/attempts-answers-service';
import {ActivatedRoute, Router} from '@angular/router';
import {QuizComments} from '../../quiz/quiz-comments/quiz-comments';
import {MatDialog} from '@angular/material/dialog';
import {DialogSuccessError} from '../../dialog/dialog-success-error/dialog-success-error';

@Component({
  selector: 'app-answer-questions',
  imports: [
    Timer,
    NgClass,
    ReactiveFormsModule,
    FormsModule,
    QuizComments,
  ],
  templateUrl: './answer-questions.html',
  styleUrl: './answer-questions.css'
})
export class AnswerQuestions implements OnInit{
  protected readonly Category = Category;

  public quizId: string | null = null
  public index: number = 0;
  public answers_user: { [index: number]: Answers} = {};

  constructor(
    public questionService: QuestionService,
    public quizzesService: QuizzesService,
    public attemptsAnswersService: AttemptsAnswersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly allQuizzesService: QuizzesService,
    private readonly dialog: MatDialog,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.quizId = id;
    if (id) {
      await this.allQuizzesService.getQuizById(id);
    }    console.log("ngOnInit answer question", this.quizzesService.quiz$.value)
    if (this.quizzesService.quiz$.value) {
      await this.questionService.fetchQuestionsWithAnswersByQuizId(this.quizzesService.quiz$.value?.id)
    }
  }

  public get question(): QuestionCreate | null  {
    if (this.questionService.question$.value) {
      return this.questionService.question$.value?.[this.index];
    } else {
      return null;
    }
  }

  public set question(question: QuestionCreate) {
    this.questionService.question$.next([question]);
  }

  public get quizz(): Quizzes | null {
    if (this.quizzesService.quiz$.value) {
      return this.quizzesService.quiz$.value;
    } else {
      return null;
    }
  }

  public set quizz(quizz: Quizzes) {
    this.quizzesService.quiz$.next(quizz);
    this.questionService.fetchQuestionsWithAnswersByQuizId(quizz?.id);
  }

  public get isCurrentQuestionAnswered(): boolean {
    return this.answers_user[this.index] !== undefined;
  }

  public question_next() {
    if (!this.isCurrentQuestionAnswered) {
      return;
    }

    this.index ++;
    if (this.questionService.question$.value?.length)  {
      if (this.index === this.questionService.question$.value?.length - 1) {
        this.index = this.questionService.question$.value?.length - 1;
      }
      if (this.index + 1 === (this.quizz?.questions?.length ?? 0)) {
        console.log("ici")
      }
    }
    console.log("question_next", this.quizz?.questions?.length, this.index)
    console.log("Quiz value:", this.quizz);
    console.log("Questions:", this.quizz?.questions);
  }

  public question_back () {
    this.index --;
    if (this.index === 0) {
      this.index = 0;
    }
  }

  public answers_user_true(is_correct: boolean, text: string, index: number, id: string | undefined ) {
    if (this.questionService.question$.value && this.question && this.quizz) {
      this.answers_user[index] = {question_id: this.question.id, is_correct, text, id, quiz_id: this.quizz.id};
    }
  }

  public async submit_answer() {
    if (!this.isCurrentQuestionAnswered) {
      this.dialog.open(DialogSuccessError, {
        width: '400px',
        height: '170px',
        data: {
          message: 'Veuillez vérifier que les réponses ont bien été cochées',
          type: 'error'
        }
      });
      return;
    }

    try {
      const total_answers: number = Object.values(this.answers_user).length;
      console.log("current", this.answers_user);

      await this.attemptsAnswersService.insertAttemptAnswers(this.answers_user);
      await this.attemptsAnswersService.getAttemptsAnswers(this.quizz?.id);
      await this.attemptsAnswersService.matchAnswersUser(
        this.attemptsAnswersService.getAllAnswersQuiz,
        this.answers_user
      );
      await this.attemptsAnswersService.insertAttempts(total_answers, this.quizz?.id);

      this.dialog.open(DialogSuccessError, {
        width: '400px',
        height: '170px',
        data: {
          message: 'Le quiz a été rempli avec succès !',
          type: 'success'
        }
      });

      this.router.navigate(['all-quizzes']);

    } catch (error) {
      console.error("Erreur lors du quiz", error);
      this.dialog.open(DialogSuccessError, {
        width: '400px',
        height: '170px',
        data: {
          message: 'Une erreur est survenue lors de la validation du quiz',
          type: 'error'
        }
      });
    }
  }

}
