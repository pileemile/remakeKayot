import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../../service/question/question-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {Timer} from '../../timer/timer';
import {Category, QuestionCreate, Quizzes} from '../../../models/quizzes/quizzes';
import {NgClass} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Answers} from '../../../models/answer/answer';
import {AttemptsAnswersService} from '../../../service/attempts/attempts-answers-service';

@Component({
  selector: 'app-answer-questions',
  imports: [
    Timer,
    NgClass,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './answer-questions.html',
  styleUrl: './answer-questions.css'
})
export class AnswerQuestions implements OnInit{
  protected readonly Category = Category;

  public index: number = 0;
  public answers_user: { [index: number]: Answers} = {};

  constructor(
    public questionService: QuestionService,
    public quizzesService: QuizzesService,
    public attemptsAnswersService: AttemptsAnswersService
  ) {}

 async ngOnInit() {
    if (this.quizzesService.quizzesId$.value) {
      await this.questionService.getQuestionByIdWithAnswer(this.quizzesService.quizzesId$.value?.id)
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
    if (this.quizzesService.quizzesId$.value) {
      return this.quizzesService.quizzesId$.value;
    } else {
      return null;
    }
  }

  public set quizz(quizz: Quizzes) {
    this.quizzesService.quizzesId$.next(quizz);
    this.questionService.getQuestionByIdWithAnswer(quizz?.id);
  }

  public question_next() {
    this.index ++;
    if (this.questionService.question$.value?.length)  {
      if (this.index === this.questionService.question$.value?.length - 1) {
        this.index = this.questionService.question$.value?.length - 1;
      }
    }
  }

  public question_back () {
    this.index --;
    if (this.index === 0) {
      this.index = 0;
    }
  }

  public answers_user_true(is_correct: boolean, text: string, index: number, id: string | undefined) {
    if (this.questionService.question$.value && this.question && this.quizz) {
      this.answers_user[index] = {question_id: this.question.id, is_correct, text, id, quiz_id: this.quizz.id};

    }
  }

  public async submit_answer() {
    const total_answers: number = Object.values(this.answers_user).length;

    // this.attemptsAnswersService.matchAnswers(this.question?.answers, this.index, this.answers_user);
    //  await this.attemptsAnswersService.insertAttemptAnswers(this.answers_user);
     await this.attemptsAnswersService.getAttemptsAnswers(this.quizz?.id);
     await this.attemptsAnswersService.matchAnswersUser(this.attemptsAnswersService.getAllAnswersQuiz, this.answers_user);
     await this.attemptsAnswersService.insertAttempts(total_answers, this.quizz?.id);
  }

}
