import {Component, OnInit} from '@angular/core';
import {AnswerService} from '../../service/answers/answer-service';
import {AnswerQuestions} from '../../component/question/answer-questions/answer-questions';
import {QuizComments} from '../../component/quiz/quiz-comments/quiz-comments';
import {QuizzesService} from '../../service/quizzes/quizzes-service';
import {Quizzes} from '../../models/quizzes/quizzes';
import {ActivatedRoute} from '@angular/router';

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
  public currentQuiz: Quizzes | null = null;

  constructor(
    private answerService: AnswerService,
    private quizzesService: QuizzesService,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      await this.quizzesService.getQuizzesById(quizId);
      this.currentQuiz = this.quizzesService.quizzesId$.value;
    }
  }
}