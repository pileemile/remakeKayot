import { Component } from '@angular/core';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-button-quiz-filter',
  imports: [
    NgClass
  ],
  templateUrl: './button-quiz-filter.html',
  styleUrl: './button-quiz-filter.css'
})
export class ButtonQuizFilter {
  constructor(
    private quizzesService: QuizzesService,
  ){}

  public toggleFilterQuizzes() {
    this.quizzesService.activeTab = this.quizzesService.activeTab === 'filter' ? null : 'filter';
  }

  public get btnFilterQuizzes() {
    return this.quizzesService.activeTab === 'filter';
  }
}
