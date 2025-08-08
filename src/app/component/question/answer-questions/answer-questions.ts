import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../../service/question/question-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {Timer} from '../../timer/timer';
import {Category, QuestionCreate, Quizzes} from '../../../models/quizzes/quizzes';
import {NgClass} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AttemptsService} from '../../../service/attempts/attempts-service';
import {Attempts} from '../../../models/attempts/attempts';
import {Answers} from '../../../models/answer/answer';

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

  public answers_user: { [index: number]: Answers } = {};

  constructor(
    public questionService: QuestionService,
    public quizzesService: QuizzesService,
    public attemptsService: AttemptsService,
  ) {}

 async ngOnInit() {
    if (this.quizzesService.quizzesId$.value) {
      await this.questionService.getQuestionByIdWithAnswer(this.quizzesService.quizzesId$.value?.id)
    }
   console.log("question", this.questionService.question$.value);

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
       console.log("question", this.questionService.question$.value);
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

  public answers_user_true(is_correct: boolean, text: string, index: number) {
    this.answers_user[index] = {question_id: '', is_correct, text };
    console.log("answers_user", this.answers_user);
  }

  public submit_answer() {
    const questions = this.questionService.question$.value;
    let score = 0;

    questions?.forEach((question, i) => {
      const correctAnswer = question.answers.find(a => a.is_correct);

      if (this.answers_user[i].text === correctAnswer?.text) {
        score++;
      } else {
        console.log("erreur sur les réponses")
      }
    });

  }

}
