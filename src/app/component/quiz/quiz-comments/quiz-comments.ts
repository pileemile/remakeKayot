import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {QuizCommentService} from '../../../service/quiz-comment/quiz-comment-service';
import {CommonModule} from '@angular/common';
import {Comments} from '../../comments/comments';
import {ActivatedRoute} from '@angular/router';
import {QuizRatingService} from '../../../service/quiz-rating/quiz-rating-service';

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
  @Input() quizId!: string;

  public commentForm: FormGroup;
  public isSubmitting = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    protected quizCommentsService: QuizCommentService,
    private readonly quizRatingService: QuizRatingService,
    private readonly route: ActivatedRoute,
  ) {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment_updated: ['', [Validators.minLength(3), Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.loadData().then();
  }

  private async loadData(){
    this.quizCommentsService.quizIdForComment = this.route.snapshot.paramMap.get('id');
    await this.quizRatingService.getQuizRating(this.quizCommentsService.quizIdForComment);
    await this.loadCommentsByQuiz();
  }

  public get quizComments() {
    return this.quizCommentsService.comments$.value;
  }

  public async onSubmitComment() {
    if (this.commentForm.valid && !this.isSubmitting) {
      try {
        this.isSubmitting = true;
        const { comment, rating } = this.commentForm.value;
        await this.quizCommentsService.addComment(this.quizId, comment, rating);
        await this.quizCommentsService.loadCommentsByQuiz();
        this.commentForm.reset({ rating: 0 });
      } catch (error) {
        console.error('Erreur du commentaire ou rating:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  public async loadCommentsByQuiz() {
    try {
        const comments = await this.quizCommentsService.getCommentsByQuizId(this.quizCommentsService.quizIdForComment);
        this.quizCommentsService.comments$.next(comments);
    } catch (error) {
      console.error('Erreur chargement des commentaires:', error);
    }
  }

  public setRating(star: number) {
    this.commentForm.get('rating')?.setValue(star);
  }

  public get quizRating() {
    return this.quizRatingService.quizRatingAll$.value
  }

}
