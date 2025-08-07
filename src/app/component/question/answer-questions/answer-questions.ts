import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../../service/question/question-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {Timer} from '../../timer/timer';
import {Category, QuestionCreate, Quizzes} from '../../../models/quizzes/quizzes';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-answer-questions',
  imports: [
    Timer,
    NgClass,
  ],
  templateUrl: './answer-questions.html',
  styleUrl: './answer-questions.css'
})
export class AnswerQuestions implements OnInit{
  protected readonly Category = Category;

  public index: number = 0;

  constructor(
    public questionService: QuestionService,
    public quizzesService: QuizzesService,
  ) {}

 async ngOnInit() {
    if (this.quizzesService.quizzesId$.value) {
      await this.questionService.getQuestionByIdWithAnswer(this.quizzesService.quizzesId$.value?.id)
    }
   console.log("question", this.questionService.question$.value)
  }

  public get question(): QuestionCreate | null {
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

}
