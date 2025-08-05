import {Component, OnInit} from '@angular/core';
import {AnswerService} from '../../service/answers/answer-service';
import {AnswerQuestions} from '../../component/question/answer-questions/answer-questions';

@Component({
  selector: 'app-answer-quiz',
  imports: [
    AnswerQuestions
  ],
  templateUrl: './answer-quiz.html',
  styleUrl: './answer-quiz.css'
})
export class AnswerQuiz implements OnInit{

  constructor(
    private answerService: AnswerService,
  ) {}
  ngOnInit() {
    this.answerService.answersAll$.value
  }
}
