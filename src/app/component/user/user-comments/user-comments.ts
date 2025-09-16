import {Component, OnInit} from '@angular/core';
import {Accordion} from '../../accordion/accordion';
import {QuizCommentService} from '../../../service/quiz-comment/quiz-comment-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {initAccordions} from 'flowbite';

@Component({
  selector: 'app-user-comments',
  imports: [
    Accordion
  ],
  templateUrl: './user-comments.html',
  styleUrl: './user-comments.css'
})
export class UserComments implements OnInit {

  constructor(
    private quizCommentService: QuizCommentService,
    private quizzesService: QuizzesService,
  ) {
  }

  async ngOnInit() {
    initAccordions();

    await this.quizCommentService.loadCommentByUser();
    await this.quizzesService.fetchQuizzesFromUserComments(this.commentUserByQuizId);
    await this.quizCommentService.getAllCommentsByQuiz(this.quizId);
  }

  private get commentUserByQuizId() {
    return this.quizCommentService.commentUser.value;
  }

  public get quizId() {
    return this.quizzesService.quizzesFromUserComments.value;
  }

}
