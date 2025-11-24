import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../../service/question/question-service';
import {QuizService} from '../../../service/quiz/quiz-service';
import {Quiz} from '../../../models/quiz/quiz';
import {NgClass} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Answers} from '../../../models/answer/answer';
import {AttemptsAnswersService} from '../../../service/attempts/attempts-answers-service';
import {ActivatedRoute, Router} from '@angular/router';
import {QuizComments} from '../../quiz/quiz-comments/quiz-comments';
import {MatDialog} from '@angular/material/dialog';
import {DialogSuccessError} from '../../dialog/dialog-success-error/dialog-success-error';
import {QuestionCreate} from '../../../models/question/question';

@Component({
  selector: 'app-answer-questions',
  imports: [
    NgClass,
    ReactiveFormsModule,
    FormsModule,
    QuizComments,
  ],
  templateUrl: './answer-questions.html',
  styleUrls: ['./answer-questions.css']
})
export class AnswerQuestions implements OnInit {

  public quizId: string | null = null;
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
  ) {}

  ngOnInit() {
    this.loadQuestionAndAnswers();
  }

  private async loadQuestionAndAnswers(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.quizId = id;

    if (id) {
      const quiz = await this.allQuizService.getQuizById(id);
      if (quiz) {
        await this.questionService.fetchQuestionsWithAnswersByQuizId(quiz.id);
      }
    }
    console.log("aaa", this.quizz?.category);
  }

  private getXpByDifficulty(difficulty: string | undefined): number {
    let xp = 0;

    switch (difficulty) {
      case 'Facile':
        xp = 50;
        break;
      case 'Moyen':
        xp = 100;
        break;
      case 'Difficile':
        xp = 200;
        break;
      default:
        xp = 0;
    }

    console.log(`🎯 Difficulté du quiz : ${difficulty} → XP attribué : ${xp}`);
    return xp;
  }


  public get question(): QuestionCreate | null {
    return this.questionService.question$.value?.[this.index] || null;
  }

  public set question(question: QuestionCreate) {
    this.questionService.question$.next([question]);
  }

  public get quizz(): Quiz | null {
    return this.quizService.quiz$.value || null;
  }

  public get category(): string | null {
    return this.quizz?.category_id || null;
  }

  public get isCurrentQuestionAnswered(): boolean {
    return this.answers_user[this.index] !== undefined;
  }

  public question_next() {
    if (!this.isCurrentQuestionAnswered) return;

    this.index++;
    const questionsLength = this.questionService.question$.value?.length || 0;
    if (this.index >= questionsLength) {
      this.index = questionsLength - 1;
    }
  }

  public question_back() {
    this.index--;
    if (this.index < 0) this.index = 0;
  }

  public answers_user_true(is_correct: boolean, text: string, index: number, id: string | undefined) {
    if (!this.question || !this.quizz) return;

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

  public async submit_answer() {
    if (!this.isCurrentQuestionAnswered) {
      this.dialog.open(DialogSuccessError, {
        width: '450px',
        height: '250px',
        data: {
          message: 'Veuillez vérifier que les réponses ont bien été cochées',
          type: 'error'
        }
      });
      return;
    }

    try {
      const total_answers: number = Object.values(this.answers_user).length;

      const result = await this.attemptsAnswersService.insertAttempts(
        total_answers,
        this.quizz?.id,
        this.quizz?.title
      );

      if (!result) {
        throw new Error('Erreur lors de la soumission du quiz');
      }

      const { percentage, isPassed } = result;

      if (isPassed) {
        const xpGained = this.getXpByDifficulty(this.quizz?.difficulty);
        await this.attemptsAnswersService.addUserXp('22ce5a89-1db2-46e7-a265-c929697ff1d0', xpGained);

        this.dialog.open(DialogSuccessError, {
          width: '450px',
          height: '250px',
          data: {
            message: `Félicitations ! Vous avez réussi le quiz avec ${Math.round(percentage)}%.`,
            type: 'success'
          }
        });

        this.answers_user = {};

        this.router.navigate(['all-quiz']);
      } else {
        this.dialog.open(DialogSuccessError, {
          width: '450px',
          height: '250px',
          data: {
            message: `Vous avez obtenu ${Math.round(percentage)}%. Il faut au moins 75% pour réussir. Veuillez recommencer le quiz.`,
            type: 'error'
          }
        });
      }

    } catch (error) {
      console.error("Erreur lors du quiz", error);
      this.dialog.open(DialogSuccessError, {
        width: '450px',
        height: '250px',
        data: {
          message: 'Une erreur est survenue lors de la validation du quiz',
          type: 'error'
        }
      });
    }
  }
}
