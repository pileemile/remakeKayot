import { Component } from '@angular/core';
import {Category, Difficulty} from '../../../models/quizzes/quizzes';

@Component({
  selector: 'app-search-component',
  imports: [],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css'
})
export class SearchComponent {

  public constructor(
  ) { }

  public get categories() {
    return Object.values(Category);
  }

  public get difficulties() {
    return Object.values(Difficulty);
  }

}
