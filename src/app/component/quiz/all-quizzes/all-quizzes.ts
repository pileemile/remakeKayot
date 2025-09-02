import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {PaginationService} from '../../../service/pagination/pagination-service';
import {Pagination} from '../../pagination/pagination';
import {TableAction, TableColumn} from '../../../models/tables/tables-interface';
import {Table} from '../../table/table';
import {PaginationType} from '../../pagination/constent';

@Component({
  selector: 'app-all-quizzes',
  imports: [
    Pagination,
    Table
  ],
  templateUrl: './all-quizzes.html',
  styleUrl: './all-quizzes.css'
})
export class AllQuizzes implements OnInit{
  constructor(
    private allQuizzesService: QuizzesService,
    private router: Router,
    private paginationService: PaginationService,
  ) {}

 async ngOnInit() {
   await this.paginationService.paginationQuizzes(this.paginationService.pagination$.value?.page, this.paginationService.pagination$.value?.limit);

 }
  public tableColumns: TableColumn[] = [
    { key: 'title', label: 'Titre' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'difficulty', label: 'Difficulty' },
    { key: 'action', label: 'Action', type: 'action' }
  ];

  public tableActions: TableAction[] = [
    {
      icon: 'arrow-right',
      handler: (quiz) => this.getQuizById(quiz.id)
    }
  ];

  public get all_quizzes() {
    return this.allQuizzesService.allQuizzes$.value;
  }

  public async getQuizById(id: string) {
  await this.allQuizzesService.getQuizzesById(id);
  await this.router.navigate(['/answer-quiz/' + id]);

  }


  protected readonly PaginationType = PaginationType;
}
