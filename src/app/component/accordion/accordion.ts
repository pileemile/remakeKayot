import {Component, Input} from '@angular/core';
import {Quiz} from '../../models/quizzes/quizzes';
import {QuizCommentService} from '../../service/quiz-comment/quiz-comment-service';


@Component({
  selector: 'app-accordion',
  imports: [
  ],
  templateUrl: './accordion.html',
  styleUrl: './accordion.css'
})
export class Accordion {
  @Input() headAccordion: Quiz[] | null = null;
  openIndex: number | null = null;

  constructor(private readonly quizCommentService: QuizCommentService) {}

  toggle(index: number, quiz_id: string) {
    this.openIndex = this.openIndex === index ? null : index;
    this.clickQuizComment(quiz_id).then;
  }

  isOpen(index: number) {
    return this.openIndex === index;
  }

  public async clickQuizComment(quiz_id: string) {
    await this.quizCommentService.getCommentByQuizId(quiz_id);
  }

  public get comments() {
    return this.quizCommentService.commentByQuiz;
  }

}
