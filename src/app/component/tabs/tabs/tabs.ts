import { Component } from '@angular/core';
import {SearchBar} from '../../search/search-bar/search-bar';
import {ButtonAllQuiz} from '../../quiz/button-all-quiz/button-all-quiz';

@Component({
  selector: 'app-tabs',
  imports: [
    SearchBar,
    ButtonAllQuiz,
  ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css'
})
export class Tabs {


}
