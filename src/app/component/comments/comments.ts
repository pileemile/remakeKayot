import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import {Comment} from '../../models/quiz-comment/quiz-comment';
import {QuizCommentService} from '../../service/quiz-comment/quiz-comment-service';
import {CommonModule} from '@angular/common';
import {QuizRating} from '../../models/quiz-rating/quiz-rating';
import {QuizRatingService} from '../../service/quiz-rating/quiz-rating-service';
import {comment} from 'postcss';

@Component({
  selector: 'app-comments',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})
export class Comments implements OnInit{
  @Input() comments: Comment[] = [];
  @Input() ratingComment: QuizRating[] | null = [];
  @Output() loadComment = new EventEmitter<Comment>();

  public commentForm: FormGroup;
  public editingCommentId: string | null = null;
  public editText: string = '';
  public commentRanting:[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly quizCommentsService: QuizCommentService,
    public quizRatingService: QuizRatingService,
  ) {
    this.commentForm = this.formBuilder.group({
      comment_updated: ['', [Validators.minLength(3), Validators.maxLength(500)]],
    });
  }

  async ngOnInit(){
    await this.quizCommentsService.getCommentsByQuizId(this.quizCommentsService.quizIdForComment);
    await this.quizRatingService.quizRatingByComment;
    console.log("commentaires de ranting", this.commentRanting);
    console.log("rating", this.quizRatingService.quizRatingByComment);
  }

  public startEdit(comment: Comment) {
    this.editingCommentId = comment.id;
    this.editText = comment.text;
  }

  public cancelEdit() {
    this.editingCommentId = null;
    this.editText = '';
  }

  public async saveEdit(commentId: string) {
    if (!this.editText.trim()) {
      return;
    }
    console.log(this.editText);
    try {
      console.log(commentId, this.editText);
      await this.quizCommentsService.updateComment(commentId, this.editText);
      this.editingCommentId = null;
      this.editText = '';
      await this.quizCommentsService.loadCommentsByQuiz();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
    }
  }

  public formatDate(dateString: Date) {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return "il y a moins d'une minute";
    } else if (diffMinutes < 60) {
      return `il y a ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    } else if (diffHours < 24) {
      return `il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
    } else {
      return `il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    }
  }

  public async deleteComment(commentId: string) {
    try {
      await this.quizCommentsService.deleteComment(commentId);
      await this.quizCommentsService.loadCommentsByQuiz();
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
    }
  }

}
