import {Component, OnInit} from '@angular/core';
import {AnswerService} from '../../service/answers/answer-service';
import {AnswerQuestions} from '../../component/question/answer-questions/answer-questions';
import {QuizComments} from '../../component/quiz/quiz-comments/quiz-comments';
import {QuizzesService} from '../../service/quizzes/quizzes-service';
import {Quizzes} from '../../models/quizzes/quizzes';

@Component({
  selector: 'app-answer-quiz',
  imports: [
    AnswerQuestions,
    QuizComments
  ],
  templateUrl: './answer-quiz.html',
  styleUrl: './answer-quiz.css'
})
export class AnswerQuiz implements OnInit{

  public quizId: Quizzes | null = null;

  constructor(
    private answerService: AnswerService,
    private quizzesService: QuizzesService,
  ) {}
  ngOnInit() {
    this.answerService.answersAll$.value;
    this.quizId = this.quizzesService.quizzesId$.value;
  }
}
