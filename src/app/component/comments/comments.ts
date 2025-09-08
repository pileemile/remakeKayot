import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {differenceInMinutes} from 'date-fns';
import {QuizComment} from '../../models/quiz-comment/quiz-comment';
import {QuizCommentService} from '../../service/quiz-comment/quiz-comment-service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-comments',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})
export class Comments {
  @Input() comments: QuizComment [] = [];

  @Output() loadComment = new EventEmitter<QuizComment>();

  public commentForm: FormGroup;
  public isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private quizCommentsService: QuizCommentService
  ) {
    this.commentForm = this.formBuilder.group({
      comment_updated: ['', [Validators.minLength(3), Validators.maxLength(500)]],
    })
  }

  public toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.commentForm.get('comment_updated')?.enable();
    } else {
      this.commentForm.get('comment_updated')?.disable();
    }
  }

  public formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const dateMinute = differenceInMinutes(now, date);

    return dateMinute < 1 ? 'il y a moins une minute' : `${dateMinute} minutes`;
  }


  public async deleteComment(commentId: string) {
    await this.quizCommentsService.deleteComment(commentId);
    await this.quizCommentsService.loadCommentsByQuiz();
  }

  public async updateComment(commentId: string) {
    await this.quizCommentsService.updateComment(commentId, this.commentForm.get('comment_updated')?.value);
    this.isEditing = false;
    await this.quizCommentsService.loadCommentsByQuiz();
  }

}
