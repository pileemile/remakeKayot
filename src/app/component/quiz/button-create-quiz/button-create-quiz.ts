import { Component } from '@angular/core';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-button-create-quiz',
  imports: [
    NgClass
  ],
  templateUrl: './button-create-quiz.html',
  styleUrl: './button-create-quiz.css'
})
export class ButtonCreateQuiz {
  constructor(
    private quizzesService: QuizzesService,
  ){}

  public toggleCreateQuiz() {
    this.quizzesService.activeTab = this.quizzesService.activeTab === 'create' ? null : 'create';
  }

  public get create() {
    return this.quizzesService.activeTab === 'create';
  }
}
