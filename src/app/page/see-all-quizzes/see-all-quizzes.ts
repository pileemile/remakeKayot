import { Component } from '@angular/core';
import {SearchBar} from '../../component/search-bar/search-bar';
import {Pagination} from '../../component/pagination/pagination';
import {AllQuizzes} from '../../component/quiz/all-quizzes/all-quizzes';

@Component({
  selector: 'app-see-all-quizzes',
  imports: [
    SearchBar,
    Pagination,
    AllQuizzes
  ],
  templateUrl: './see-all-quizzes.html',
  styleUrl: './see-all-quizzes.css'
})
export class SeeAllQuizzes {

}
