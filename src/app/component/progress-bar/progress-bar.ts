import {Component, OnInit} from '@angular/core';
import {LevelService} from '../../service/level/level-service';
import {IProgressBar} from '../../models/progress-bar/progress-bar';
import {Level} from '../../models/level/level';
import {MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'app-progress-bar',
  imports: [
    MatTooltipModule
  ],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css'
})
export class ProgressBar implements OnInit {
  public progressBarValue: IProgressBar = {current_xp: 0, current_level: 0};
  public levels: Level[] = [];
  public levelsSupérieurs: Level[] = [];

  constructor(
    private readonly levelService: LevelService
  ) {
  }

  ngOnInit() {
    this.loadData().then();
  }

  async loadData(): Promise<void> {
    await this.levelService.getUserLevel("22ce5a89-1db2-46e7-a265-c929697ff1d0");
    await this.levelService.getAllLevels();

    this.levelsSupérieurs = this.levelService.getLevelsSupérieurs();
  }

  public getXpRestantPourNiveau(targetLevelId: string): number {
    return this.levelService.getXpRestantPourNiveau(targetLevelId);
  }

  public getProgressToNextLevel(): number {
    return this.levelService.getProgressToNextLevel();
  }

  public getGlobalProgress(): number {
    return this.levelService.getGlobalProgress();
  }

  public getProgressTooltip(): string {
    return this.levelService.getProgressTooltip();
  }


}
