import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {QuizCommentService} from '../../../service/quiz-comment/quiz-comment-service';
import {Quizzes} from '../../../models/quizzes/quizzes';
import {CommonModule} from '@angular/common';
import {Comments} from '../../comments/comments';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-quiz-comments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Comments
  ],
  templateUrl: './quiz-comments.html',
  styleUrl: './quiz-comments.css'
})
export class QuizComments implements OnInit{
  @Input() quizId!: Quizzes;

  public commentForm: FormGroup;
  public isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private quizCommentsService: QuizCommentService,
    private quizzesService: QuizzesService,
  ) {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      comment_updated: ['', [Validators.minLength(3), Validators.maxLength(500)]],
    });
  }

  async ngOnInit() {
    if (this.quizzesService.quizzesId$.value) {
      await this.quizCommentsService.loadCommentsByQuiz();
    }
  }

  public async onSubmitComment() {
    if (this.commentForm.valid && !this.isSubmitting) {
      console.log("ici")
      console.log("isSubmite=ing", this.isSubmitting);
      try {
        const commentText = this.commentForm.get('comment')?.value;
        await this.quizCommentsService.addComment(this.quizId, commentText);
        await this.quizCommentsService.loadCommentsByQuiz();
        this.commentForm.reset();
      } catch (error) {
        console.error('Erreur du commentaire:', error);
      }
    }
  }

  public get comments() {
    return this.quizCommentsService.comments.value;
  }

}
