import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../../service/question/question-service';
import {QuizService} from '../../../service/quiz/quiz-service';
import {Category, QuestionCreate, Quiz} from '../../../models/quiz/quiz';
import {NgClass} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Answers} from '../../../models/answer/answer';
import {AttemptsAnswersService} from '../../../service/attempts/attempts-answers-service';
import {ActivatedRoute, Router} from '@angular/router';
import {QuizComments} from '../../quiz/quiz-comments/quiz-comments';
import {MatDialog} from '@angular/material/dialog';
import {DialogSuccessError} from '../../dialog/dialog-success-error/dialog-success-error';
import {NotificationService} from '../../../service/notification/notification-service';

@Component({
  selector: 'app-answer-questions',
  imports: [
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
    public attemptsAnswersService: AttemptsAnswersService,
    private readonly quizService: QuizService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly allQuizService: QuizService,
    private readonly dialog: MatDialog,
    private readonly notificationService: NotificationService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.quizId = id;
    if (id) {
      await this.allQuizService.getQuizById(id);
    }
    if (this.quizService.quiz$.value) {
      await this.questionService.fetchQuestionsWithAnswersByQuizId(this.quizService.quiz$.value?.id);
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

  public get quizz(): Quiz | null {
    if (this.quizService.quiz$.value) {
      return this.quizService.quiz$.value;
    } else {
      return null;
    }
  }

  public set quizz(quizz: Quiz) {
    this.quizService.quiz$.next(quizz);
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
      }
    }
  }

  public question_back () {
    this.index --;
    if (this.index === 0) {
      this.index = 0;
    }
  }

  public answers_user_true(is_correct: boolean, text: string, index: number, id: string | undefined ) {
    if (this.questionService.question$.value && this.question && this.quizz) {
      this.answers_user[index] = {
        question_id: this.question.id,
        is_correct,
        text,
        id,
        quiz_id: this.quizz.id
      };
      this.attemptsAnswersService.recoverAnswersUser.next([
        ...this.attemptsAnswersService.recoverAnswersUser.value,
        {
          question_id: this.question.id,
          selected_answer_id: id ?? '',
          quiz_id: this.quizz.id,
          user_id: '22ce5a89-1db2-46e7-a265-c929697ff1d0'
        }
      ]);
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
      await this.attemptsAnswersService.insertAttempts(total_answers, this.quizz?.id);
      console.log("recovery Answers", this.attemptsAnswersService.recoverAnswersUser.value);
      this.dialog.open(DialogSuccessError, {
        width: '400px',
        height: '170px',
        data: {
          message: 'Le quiz a été rempli avec succès !',
          type: 'success'
        }
      });

      this.router.navigate(['all-quiz']);

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
