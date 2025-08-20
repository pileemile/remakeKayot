import { Component } from '@angular/core';
import {Pagination} from '../../component/pagination/pagination';
import {AllQuizzes} from '../../component/quiz/all-quizzes/all-quizzes';
import {Tabs} from '../../component/tabs/tabs/tabs';
import {SearchComponent} from '../../component/search/search-component/search-component';
import {QuizzesService} from '../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-see-all-quizzes',
  imports: [
    Pagination,
    AllQuizzes,
    Tabs,
    SearchComponent
  ],
  templateUrl: './see-all-quizzes.html',
  styleUrl: './see-all-quizzes.css'
})
export class SeeAllQuizzes {
  constructor(
    public quizzesService: QuizzesService,
  ) {}

  public get search() {
    try {
      return this.quizzesService.search;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  public get btnAllQuizzes() {
    try {
      return this.quizzesService.btnAllQuizzes;
    } catch (e) {
      console.log(e)
      return false;
    }
  }
}
