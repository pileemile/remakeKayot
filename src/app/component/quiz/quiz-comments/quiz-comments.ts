import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {differenceInMinutes} from 'date-fns';
import {QuizComment} from '../../../models/quiz-comment/quiz-comment';
import {QuizCommentService} from '../../../service/quiz-comment/quiz-comment-service';
import {Quizzes} from '../../../models/quizzes/quizzes';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-quiz-comments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './quiz-comments.html',
  styleUrl: './quiz-comments.css'
})
export class QuizComments implements OnInit{
  @Input() quizId!: Quizzes;

  public commentForm: FormGroup;
  public comments: QuizComment[] = [];
  public isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private quizCommentsService: QuizCommentService
  ) {
    this.commentForm = this.formBuilder.group({
      text: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
    });
  }

  async ngOnInit() {
    if (this.quizId) {
      await this.loadComments();
    }
  }

  private async loadComments() {
    try {
      this.comments = await this.quizCommentsService.getCommentsByQuizId(this.quizId);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  }

  public async onSubmitComment() {
    if (this.commentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      try {
        const commentText = this.commentForm.get('text')?.value;
        await this.quizCommentsService.addComment(this.quizId, commentText);
        await this.loadComments();
        this.commentForm.reset();
      } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const dateMinute = differenceInMinutes(now, date);

    switch (true) {
      case dateMinute < 1:
        return `Il y a ${dateMinute} minute${dateMinute > 1 ? 's' : ''}`;
      case dateMinute < 60:
        return `Il y a  }`;
      case dateMinute < 1440:
        return `Il y a ${dateMinute} heure${dateMinute > 1 ? 's' : ''}`;
      default:
        return `Il y a ${dateMinute} jour${dateMinute > 1 ? 's' : ''}`;
    }
  }

}
