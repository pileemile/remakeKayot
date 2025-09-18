import { Component } from '@angular/core';
import {QuizService} from '../../../service/quiz/quiz-service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-button-all-users',
  imports: [
    NgClass
  ],
  templateUrl: './button-all-users.html',
  styleUrl: './button-all-users.css'
})
export class ButtonAllUsers {
  constructor(
    private quizzesService: QuizService,
  ){}

  public toggleCreateQuiz() {
    this.quizzesService.activeTab = this.quizzesService.activeTab === 'create' ? null : 'create';
  }

  public get create() {
    return this.quizzesService.activeTab === 'create';
  }
}
