import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../../service/question/question-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {AnswerQuiz} from '../../answer/answer-quiz/answer-quiz';
import {Timer} from '../../timer/timer';
import {Category} from '../../../models/quizzes/quizzes';

@Component({
  selector: 'app-answer-questions',
  imports: [
    AnswerQuiz,
    Timer
  ],
  templateUrl: './answer-questions.html',
  styleUrl: './answer-questions.css'
})
export class AnswerQuestions implements OnInit{
  protected readonly Category = Category;

  constructor(
    public questionService: QuestionService,
    public quizzesService: QuizzesService,
  ) {}

 async ngOnInit() {
    if (this.quizzesService.quizzesId$.value) {
      await this.questionService.getQuestionById(this.quizzesService.quizzesId$.value?.id)
    }
   console.log("question", this.questionService.question$.value)
  }

}
