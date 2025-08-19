import { Component } from '@angular/core';
import {SearchBar} from '../../search/search-bar/search-bar';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {SearchComponent} from '../../search/search-component/search-component';
import {ButtonAllQuiz} from '../../quiz/button-all-quiz/button-all-quiz';

@Component({
  selector: 'app-tabs',
  imports: [
    SearchBar,
    SearchComponent,
    ButtonAllQuiz
  ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css'
})
export class Tabs {

  constructor(
    private quizzesService: QuizzesService,
  ) {}

  public get search() {
    try {
      return this.quizzesService.search;
    } catch (e) {
      console.log(e)
      return false;
    }
  }
}
