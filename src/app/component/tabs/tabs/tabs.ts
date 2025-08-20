import { Component } from '@angular/core';
import {SearchBar} from '../../search/search-bar/search-bar';
import {ButtonAllQuiz} from '../../quiz/button-all-quiz/button-all-quiz';
import {ButtonCreateQuiz} from '../../quiz/button-create-quiz/button-create-quiz';

@Component({
  selector: 'app-tabs',
  imports: [
    SearchBar,
    ButtonAllQuiz,
    ButtonCreateQuiz,
  ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css'
})
export class Tabs {


}
