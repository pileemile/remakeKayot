import {Component, OnInit} from '@angular/core';
import {AnswerQuestions} from '../../component/question/answer-questions/answer-questions';
import {QuizzesService} from '../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-answer-quiz',
  imports: [
    AnswerQuestions,
  ],
  templateUrl: './answer-quiz.html',
  styleUrl: './answer-quiz.css'
})
export class AnswerQuiz implements OnInit{
  public quizId: string | null = null;

  constructor(
    private readonly quizzesService: QuizzesService,
  ) {}

  ngOnInit() {
    this.quizId = this.quizzesService.quizId;
  }
}
