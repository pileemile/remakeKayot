import { Component } from '@angular/core';
import {SearchBar} from '../../search/search-bar/search-bar';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {SearchComponent} from '../../search/search-component/search-component';

@Component({
  selector: 'app-tabs',
  imports: [
    SearchBar,
    SearchComponent
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
