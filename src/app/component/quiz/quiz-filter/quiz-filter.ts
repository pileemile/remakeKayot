import {Component, OnInit} from '@angular/core';
import {TableAction, TableColumn} from '../../../models/tables/tables-interface';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {Router} from '@angular/router';
import {PaginationService} from '../../../service/pagination/pagination-service';
import {Pagination} from '../../pagination/pagination';
import {Table} from '../../table/table';
import {SearchService} from '../../../service/search-service/search-service';

@Component({
  selector: 'app-quiz-filter',
  imports: [
    Pagination,
    Table
  ],
  templateUrl: './quiz-filter.html',
  styleUrl: './quiz-filter.css'
})
export class QuizFilter implements OnInit{

  constructor(
    private allQuizzesService: QuizzesService,
    private router: Router,
    private paginationService: PaginationService,
    private searchService: SearchService,
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

  public async getQuizById(id: string) {
    await this.allQuizzesService.getQuizzesById(id);
    await this.router.navigate(['/answer-quiz/' + id]);
  }

  public get filterquiz() {
    return this.searchService.quizeFilter.value
  }
}
