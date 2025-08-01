import {Component, OnInit} from '@angular/core';
import {AnswerService} from '../../service/answers/answer-service';

@Component({
  selector: 'app-answer-quiz',
  imports: [],
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
