import {Component} from '@angular/core';
import {AllQuizzesService} from '../../../service/all-quizzes/all-quizzes';
import {Category} from '../../../models/quizzes/quizzes';

@Component({
  selector: 'app-all-quizzes',
  imports: [],
  templateUrl: './all-quizzes.html',
  styleUrl: './all-quizzes.css'
})
export class AllQuizzes{
  protected readonly Category = Category;

  constructor(
    public allQuizzesService: AllQuizzesService,
  ) {}
}
