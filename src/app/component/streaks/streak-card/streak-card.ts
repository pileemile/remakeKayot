import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreaksService } from '../../../service/streaks/streaks-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-streak-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streak-card.html'
})
export class StreakCardComponent implements OnInit, OnDestroy {
  @Input() userId: string | null = null;

  public currentStreak: number = 0;
  public longestStreak: number = 0;
  public lastActivityDate: Date | null = null;

  private destroy$ = new Subject<void>();

  constructor(private streaksService: StreaksService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadUserStreak();
    }
  }

  private loadUserStreak(): void {
    if (this.userId) {
      this.streaksService.getUserStreak(this.userId).then(() => {
        this.updateDisplayValues();
      });

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
  }

  private updateDisplayValues(): void {
    const streak = this.streaksService.userStreak$.value;
    if (streak) {
      this.currentStreak = streak.current_streak;
      this.longestStreak = streak.longest_streak;
      this.lastActivityDate = streak.last_activity_date ? new Date(streak.last_activity_date) : null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
