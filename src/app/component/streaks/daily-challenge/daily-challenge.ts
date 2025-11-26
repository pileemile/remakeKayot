import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StreaksService } from '../../../service/streaks/streaks-service';
import { DailyChallengeService } from '../../../service/daily-challenge/daily-challenge.service';
import { SessionService } from '../../../service/session-service/session-service';
import { Quiz } from '../../../models/quiz/quiz';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-daily-challenge',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-challenge.html'
})
export class DailyChallengeComponent implements OnInit, OnDestroy {
  public hasCompletedToday: boolean = false;
  public dailyQuiz: Quiz | null = null;
  public isLoading: boolean = true;
  public isCreating: boolean = false;
  public createError: string | null = null;
  private destroy$ = new Subject<void>();
  private userId: string | null = null;

  constructor(
    private streaksService: StreaksService,
    private dailyChallengeService: DailyChallengeService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.initializeDailyChallenge();
  }

  private async initializeDailyChallenge(): Promise<void> {
    this.isLoading = true;
    const user = await this.sessionService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      await this.checkDailyCompletion();
    }
    await this.loadDailyQuiz();
    this.isLoading = false;
  }

  private async checkDailyCompletion(): Promise<void> {
    if (this.userId) {
      this.hasCompletedToday = await this.streaksService.hasCompletedQuizToday(this.userId);
    }
  }

  private async loadDailyQuiz(): Promise<void> {
    this.dailyQuiz = await this.dailyChallengeService.getTodayQuiz();
  }

  public async createDailyQuiz(): Promise<void> {
    this.isCreating = true;
    this.createError = null;

    const result = await this.dailyChallengeService.createTodayQuiz();

    if (result.success) {
      await this.loadDailyQuiz();
    } else {
      this.createError = result.error || 'Erreur lors de la création du quiz quotidien';
    }

    this.isCreating = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
