import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-button-all-quiz',
  imports: [
    NgClass
  ],
  templateUrl: './button-all-quiz.html',
  styleUrl: './button-all-quiz.css'
})
export class ButtonAllQuiz {
  constructor(
    private quizzesService: QuizzesService,
  ){}

  public toggleAllQuizzes() {
    this.quizzesService.activeTab = this.quizzesService.activeTab === 'all' ? null : 'all';
  }

  public get btnAllQuizzes() {
    return this.quizzesService.activeTab === 'all';
  }
}
