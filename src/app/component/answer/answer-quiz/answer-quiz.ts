import {Component, OnInit} from '@angular/core';
import {AnswerService} from '../../../service/answers/answer-service';
import {QuestionService} from '../../../service/question/question-service';

@Component({
  selector: 'app-answer-quiz',
  imports: [],
  templateUrl: './answer-quiz.html',
  styleUrl: './answer-quiz.css'
})
export class AnswerQuiz implements OnInit {

  constructor(
    public answerService: AnswerService,
    public questionService: QuestionService,
  ) {
  }

  async ngOnInit() {
    this.questionService.question$.subscribe(
      async questions => {
        if (questions) {
          console.log(typeof this.questionService.question$.value)
          if (this.questionService.question$.value){
            const questionForAnswerservice = this.questionService.question$.value.map(
              question => ({
                id: question.id
              }
              )
            );
            console.log("ici l'id de la question", questionForAnswerservice[0].id)
            await this.answerService.getAnswersById(
              questionForAnswerservice[0].id
            );
          }
        }
      }
    );


  }
}
