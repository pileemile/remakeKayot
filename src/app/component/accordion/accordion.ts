import { Component, Input, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../models/quiz/quiz';
import { QuizCommentService } from '../../service/quiz-comment/quiz-comment-service';
import { Subject } from 'rxjs';
import { Comment} from '../../models/quiz-comment/quiz-comment';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.html',
  styleUrl: './accordion.css'
})
export class Accordion implements OnDestroy {
  @Input() headAccordion: Quiz[] | null = null;

  openIndex: number | null = null;
  isLoading = false;
  private readonly destroy$ = new Subject<void>();
  private readonly quizCommentService = inject(QuizCommentService);

  constructor() {
    this.quizCommentService.commentByQuiz
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isLoading = this.quizCommentService.loading;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async toggle(index: number, quizId: string) {
    if (this.openIndex === index) {
      this.openIndex = null;
      return;
    }
    this.openIndex = index;

    const existingComments = this.getCommentsForQuiz(quizId);
    if (existingComments.length === 0) {
      try {
        await this.loadQuizComments(quizId);
      } catch (error) {
        console.error('Erreur lors du chargement des commentaires:', error);
      }
    }
  }

  isOpen(index: number): boolean {
    return this.openIndex === index;
  }

  private async loadQuizComments(quizId: string): Promise<void> {
    await this.quizCommentService.getCommentByQuizId(quizId);
  }

  getCommentsForQuiz(quizId: string): Comment[] {
    return this.quizCommentService.getCommentsForQuiz(quizId);
  }
}
