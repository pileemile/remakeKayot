import {Component, OnInit} from '@angular/core';
import {Accordion} from '../../accordion/accordion';
import {QuizCommentService} from '../../../service/quiz-comment/quiz-comment-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-user-comments',
  imports: [
    Accordion
  ],
  templateUrl: './user-comments.html',
  styleUrl: './user-comments.css'
})
export class UserComments implements OnInit {

  private _i: number = 0;

  constructor(
    private quizCommentService: QuizCommentService,
    private quizzesService: QuizzesService,
  ) {
  }

  async ngOnInit() {
    await this.quizCommentService.loadCommentByUser();
    await this.quizzesService.filterQuizzesByQuizId(this.commentUserByQuizId)
    console.log('les quizz',this.quizId)
  }

  private get commentUserByQuizId() {
    return this.quizCommentService.commentUser.value;
  }


  public get quizId() {
    return this.quizzesService.quizzesFilterByComment$.value;
  }
}
