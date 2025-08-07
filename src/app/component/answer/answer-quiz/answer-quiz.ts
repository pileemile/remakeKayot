import {Component, OnInit} from '@angular/core';
import {AnswerService} from '../../../service/answers/answer-service';
import {QuestionService} from '../../../service/question/question-service';
import {Answers, QuestionCreate} from '../../../models/quizzes/quizzes';

@Component({
  selector: 'app-answer-quiz',
  imports: [],
  templateUrl: './answer-quiz.html',
  styleUrl: './answer-quiz.css'
})
export class AnswerQuiz implements OnInit {

  public retrieve_answer: { answers: Answers[] | null | undefined; }[] | undefined;

  constructor(
    public answersService: AnswerService,
    public questionService: QuestionService,
  ) {}

  ngOnInit() {
     // this.questionAnswersService.question_with_answers_load(0);
     this.retrieve_answer = this.answersService.answerForQuestion$.value;
  }

  // public set answers(answers: Answers[] | null | undefined) {
  //
  // }
  //
  // public get answers(): (Answers[] | null | undefined)[] {
  //   if (this.questionService.question$.value) {
  //     return this.retrieve_answer = this.questionService.question$.value.map(
  //       (question) => question.answers,
  //     );
  //
  //
  //   }
  //   return [];
  // }

}
