import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreaksService } from '../../../service/streaks/streaks-service';
import { QuizService } from '../../../service/quiz/quiz-service';
import { SessionService } from '../../../service/session-service/session-service';
import { Quiz } from '../../../models/quiz/quiz';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-daily-challenge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-challenge.html'
})
export class DailyChallengeComponent implements OnInit, OnDestroy {
  public hasCompletedToday: boolean = false;
  public nextQuizzes: Quiz[] = [];
  private destroy$ = new Subject<void>();
  private userId: string | null = null;

  constructor(
    private streaksService: StreaksService,
    private quizService: QuizService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.initializeDailyChallenge();
  }

  private async initializeDailyChallenge(): Promise<void> {
    const user = await this.sessionService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      await this.checkDailyCompletion();
      await this.loadRandomQuizzes();
    }
  }

  private async checkDailyCompletion(): Promise<void> {
    if (this.userId) {
      this.hasCompletedToday = await this.streaksService.hasCompletedQuizToday(this.userId);
    }
  }

  private async loadRandomQuizzes(): Promise<void> {
    await this.quizService.getAllQuiz();
    this.quizService.allQuizs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(quizzes => {
        if (quizzes && quizzes.length > 0) {
          this.nextQuizzes = quizzes.sort(() => 0.5 - Math.random()).slice(0, 5);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
