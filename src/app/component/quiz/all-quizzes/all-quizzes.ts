import {Component, OnInit} from '@angular/core';
import {Category,} from '../../../models/quizzes/quizzes';
import {Router, RouterLink} from '@angular/router';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {PaginationService} from '../../../service/pagination/pagination-service';
import {Pagination} from '../../pagination/pagination';

@Component({
  selector: 'app-all-quizzes',
  imports: [
    RouterLink,
    Pagination
  ],
  templateUrl: './all-quizzes.html',
  styleUrl: './all-quizzes.css'
})
export class AllQuizzes implements OnInit{
  public Category = Category;

  constructor(
    private allQuizzesService: QuizzesService,
    private router: Router,
    private paginationService: PaginationService,
  ) {}

 async ngOnInit() {
   await this.paginationService.paginationQuizzes(this.paginationService.pagination$.value?.page, this.paginationService.pagination$.value?.limit);

 }

  public get all_quizzes() {
    return this.allQuizzesService.allQuizzes$.value;
  }

  public get pagination() {
    return this.paginationService.pagination$.value;
  }


  public async getQuizById(id: string) {
  await this.allQuizzesService.getQuizzesById(id);
  await this.router.navigate(['/answer-quiz']);

  }


}
