import {Component, OnInit} from '@angular/core';
import {AnswerService} from '../../service/answers/answer-service';
import {AnswerQuestions} from '../../component/question/answer-questions/answer-questions';
import {ActivatedRoute} from '@angular/router';
import {QuizComments} from '../../component/quiz/quiz-comments/quiz-comments';

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
  public quizId: string | null = null;

  constructor(
    private answerService: AnswerService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('id');
    this.answerService.answersAll$.value
  }
}
