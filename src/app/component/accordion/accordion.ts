import {Component, Input, OnInit} from '@angular/core';
import {Quizzes} from '../../models/quizzes/quizzes';
import {QuizCommentService} from '../../service/quiz-comment/quiz-comment-service';


@Component({
  selector: 'app-accordion',
  imports: [
  ],
  templateUrl: './accordion.html',
  styleUrl: './accordion.css'
})
export class Accordion implements OnInit{
  @Input() headAccordion: Quizzes[] | null = null;
  openIndex: number | null = null;

  constructor(private quizCommentService: QuizCommentService) {}

  ngOnInit() {}

  toggle(index: number, quiz_id: string) {
    this.openIndex = this.openIndex === index ? null : index;
    this.clickQuizComment(quiz_id).then;
  }

  isOpen(index: number) {
    return this.openIndex === index;
  }

  public async clickQuizComment(quiz_id: string) {
    console.log("click", quiz_id);
    await this.quizCommentService.getCommentByQuizId(quiz_id);
  }

  public get comments() {
    return this.quizCommentService.commentByQuiz;
  }

}
