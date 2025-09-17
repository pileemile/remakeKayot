import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {QuizCommentService} from '../../../service/quiz-comment/quiz-comment-service';
import {CommonModule} from '@angular/common';
import {Comments} from '../../comments/comments';
import {ActivatedRoute} from '@angular/router';

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
    private readonly route: ActivatedRoute,
  ) {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      comment_updated: ['', [Validators.minLength(3), Validators.maxLength(500)]],
    });
  }

  async ngOnInit() {
    this.quizCommentsService.quizIdForComment = this.route.snapshot.paramMap.get('id');
    console.log("quizIdForComments", this.quizCommentsService.quizIdForComment);

    await this.loadCommentsByQuiz();

    console.log("quizCommentsService.comments.value", this.quizCommentsService.comments.value);
  }



  public async onSubmitComment() {
    if (this.commentForm.valid && !this.isSubmitting) {
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

  public async loadCommentsByQuiz() {
    try {
        const comments = await this.quizCommentsService.getCommentsByQuizId(this.quizCommentsService.quizIdForComment);
        this.quizCommentsService.comments.next(comments);
        console.log("commentaires", this.quizCommentsService.comments.value);
    } catch (error) {
      console.error('Erreur chargement des commentaires:', error);
    }
  }

}
