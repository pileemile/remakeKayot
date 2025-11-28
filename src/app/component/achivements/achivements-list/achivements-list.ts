import {Component, Input} from '@angular/core';
import {AchievementService} from '../../../service/achivements/achivement-service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-achivements-list',
  imports: [
    NgClass
  ],
  templateUrl: './achivements-list.html',
  styleUrl: './achivements-list.css',
})
export class AchivementsList {
  @Input() userId! : string;

  constructor(public readonly achievementService: AchievementService) {}

  async ngOnInit() {
    await this.achievementService.getUserAchievements(this.userId);
    await this.achievementService.getAllAchievements();
  }

  get userAchievements() {
    return this.achievementService.userAchievements$. value;
  }

  get allAchievements() {
    return this.achievementService. allAchievements$.value;
  }

  get completionPercentage() {
    return this.achievementService.getCompletionPercentage();
  }

  hasAchievement(achievementId: string): boolean {
    return this.achievementService.hasAchievement(achievementId);
  }

  formatDate(date: string | null): string {
    if (! date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
