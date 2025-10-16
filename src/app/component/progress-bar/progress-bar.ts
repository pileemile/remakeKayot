import {Component, OnInit} from '@angular/core';
import {LevelService} from '../../service/level/level-service';
import {IProgressBar} from '../../models/progress-bar/progress-bar';
import {Level} from '../../models/level/level';


@Component({
  selector: 'app-progress-bar',
  imports: [],
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

  async loadData() {
    await this.levelService.getUserLevel("22ce5a89-1db2-46e7-a265-c929697ff1d0");
    const userLevel = this.levelService.userLevel$.value;
    if (!userLevel) {
      return ;
    }
    if (userLevel) {
      this.progressBarValue = {
        current_xp: userLevel?.current_xp,
        current_level: userLevel.levels.level,
      };
    }

    await this.levelService.getAllLevels();
    this.levels = this.levelService.levels$.value;
      this.levelsSupérieurs = this.levels.filter(
        (level: Level) => level.level > this.progressBarValue.current_level
      );

    console.log('levels', this.levels);
    console.log("levelsSupérieurs", this.levelsSupérieurs);
    console.log('progressBarValue', this.progressBarValue);
  }

  public getXpRestantPourNiveau(targetLevel: number) {
    const niveauCible = this.levels.find((level: Level) => level.level === targetLevel);
    if (!niveauCible) return 0;
    return niveauCible.required_xp - this.progressBarValue.current_xp;
  }

  public getProgressToNextLevel(): number {
    const { current_xp, current_level } = this.progressBarValue;
    const currentLevelData = this.levels.find((level: Level) => level.level === current_level);
    const nextLevelData = this.levels.find((level: Level) => level.level === current_level + 1);

    if (!currentLevelData || !nextLevelData) return 100;

    const xpForCurrentLevel = currentLevelData.required_xp;
    const xpForNextLevel = nextLevelData.required_xp;
    const xpEarnedInCurrentLevel = current_xp - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;

    return Math.min(100, (xpEarnedInCurrentLevel / xpNeededForNextLevel) * 100);
  }

  public getGlobalProgress(): number {
    const { current_xp } = this.progressBarValue;
    const maxLevelData = this.levels[this.levels.length - 1];
    if (!maxLevelData) return 0;
    return Math.min(100, (current_xp / maxLevelData.required_xp) * 100);
  }



}
