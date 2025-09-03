import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizCommentsService } from '../../../service/quiz-comments/quiz-comments-service';
import { QuizComment } from '../../../models/quiz-comments/quiz-comments';

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
export class QuizComments implements OnInit {
  @Input() quizId!: string;

  public commentForm: FormGroup;
  public comments: QuizComment[] = [];
  public isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private quizCommentsService: QuizCommentsService
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
        
        // Recharger les commentaires
        await this.loadComments();
        
        // Réinitialiser le formulaire
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
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'À l\'instant';
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  }
}