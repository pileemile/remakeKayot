import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreaksService } from '../../../service/streaks/streaks-service';
import { SessionService } from '../../../service/session-service/session-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-streak-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streak-display.html',
  styleUrl: './streak-display.css'
})
export class StreakDisplayComponent implements OnInit, OnDestroy {
  public currentStreak: number = 0;
  public longestStreak: number = 0;
  public lastActivityDate: Date | null = null;
  public isUpdating: boolean = false;
  public streakMessage: string | null = null;
  public streakMessageType: 'success' | 'error' | null = null;

  private readonly destroy$ = new Subject<void>();
  private readonly userId: string = "2ce5a89-1db2-46e7-a265-c929697ff1d0";

  constructor(
    private readonly streaksService: StreaksService,
    private readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    // this.initializeUserStreak();
  }

  // private initializeUserStreak(): void {
  //   this.sessionService.getCurrentUser().then(user => {
  //     if (user) {
  //       this.userId = user.id;
  //       this.loadUserStreak();
  //       this.subscribeToStreakUpdates();
  //     }
  //   });
  // }

  private loadUserStreak(): void {
    if (this.userId) {
      this.streaksService.getUserStreak(this.userId).then(() => {
        this.updateDisplayValues();
      });
    }
  }

  private subscribeToStreakUpdates(): void {
    this.streaksService.userStreak$
      .pipe(takeUntil(this.destroy$))
      .subscribe(streak => {
        if (streak) {
          this.currentStreak = streak.current_streak;
          this.longestStreak = streak.longest_streak;
          this.lastActivityDate = streak.last_activity_date ? new Date(streak.last_activity_date) : null;
        }
      });
  }

  private updateDisplayValues(): void {
    const streak = this.streaksService.userStreak$.value;
    if (streak) {
      this.currentStreak = streak.current_streak;
      this.longestStreak = streak.longest_streak;
      this.lastActivityDate = streak.last_activity_date ? new Date(streak.last_activity_date) : null;
    }
  }

  public async updateStreakManually(): Promise<void> {
    if (!this.userId || this.isUpdating) {
      return;
    }

    this.isUpdating = true;
    this.streakMessage = null;

    try {
      await this.streaksService.updateStreak(this.userId);
      this.streakMessage = 'Série mise à jour avec succès!';
      this.streakMessageType = 'success';
      this.updateDisplayValues();
    } catch (error) {
      this.streakMessage = 'Erreur lors de la mise à jour de la série.';
      this.streakMessageType = 'error';
      console.error('Erreur:', error);
    } finally {
      this.isUpdating = false;
      setTimeout(() => {
        this.streakMessage = null;
      }, 3000);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
