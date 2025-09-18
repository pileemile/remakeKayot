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
    private readonly quizService: QuizService,
  ){}

  public toggleCreateQuiz() {
    this.quizService.activeTab = this.quizService.activeTab === 'create' ? null : 'create';
  }

  public get create() {
    return this.quizService.activeTab === 'create';
  }
}
