import { Component } from '@angular/core';
import {SearchBar} from '../../search/search-bar/search-bar';
import {ButtonAllQuiz} from '../../quiz/button-all-quiz/button-all-quiz';
import {ButtonCreateQuiz} from '../../quiz/button-create-quiz/button-create-quiz';
import {ButtonQuizFilter} from '../../quiz/button-quiz-filter/button-quiz-filter';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-tabs',
  imports: [
    SearchBar,
    ButtonAllQuiz,
    ButtonCreateQuiz,
    ButtonQuizFilter,
  ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css'
})
export class Tabs {
  constructor(
    private quizzesService: QuizzesService,
  ){}

  public get activeTab() {
    return this.quizzesService.activeTab;
  }
}
