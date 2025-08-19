import { Component } from '@angular/core';
import {Pagination} from '../../component/pagination/pagination';
import {AllQuizzes} from '../../component/quiz/all-quizzes/all-quizzes';
import {Tabs} from '../../component/tabs/tabs/tabs';

@Component({
  selector: 'app-see-all-quizzes',
  imports: [
    Pagination,
    AllQuizzes,
    Tabs
  ],
  templateUrl: './see-all-quizzes.html',
  styleUrl: './see-all-quizzes.css'
})
export class SeeAllQuizzes {

}
