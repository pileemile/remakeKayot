import {Component, OnInit} from '@angular/core';
import {Accordion} from '../../accordion/accordion';
import {QuizCommentService} from '../../../service/quiz-comment/quiz-comment-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {QuizComment} from '../../../models/quiz-comment/quiz-comment';
import {log10} from 'chart.js/helpers';
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
    await this.quizzesService.filterQuizzesByQuizId(this.commentUserByQuizId);
    await this.quizCommentService.getAllCommentsByQuiz(this.quizId);

    console.log('les quizz',this.quizId);
  }

  private get commentUserByQuizId() {
    return this.quizCommentService.commentUser.value;
  }

  public get quizId() {
    return this.quizzesService.quizzesFilterByComment$.value;
  }

}
