import {Component} from '@angular/core';
import {TableAction, TableColumn} from '../../../models/tables/tables-interface';
import {Router} from '@angular/router';
import {Pagination} from '../../pagination/pagination';
import {Table} from '../../table/table';
import {SearchService} from '../../../service/search-service/search-service';
import {PaginationType} from '../../pagination/constent';

@Component({
  selector: 'app-quiz-filter',
  imports: [
    Pagination,
    Table
  ],
  templateUrl: './quiz-filter.html',
  styleUrl: './quiz-filter.css'
})
export class QuizFilter {

  constructor(
    private readonly router: Router,
    private readonly searchService: SearchService,
  ) {}

  public tableColumns: TableColumn[] = [
    { key: 'title', label: 'Titre', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'difficulty', label: 'Difficulty', type: 'text' },
    { key: 'action', label: 'Action', type: 'action' }
  ];

  public tableActions: TableAction[] = [
    {
      icon: 'arrow-right',
      handler: (quiz) => this.getQuizByIdLoad(quiz.id)
    }
  ];

  public async getQuizByIdLoad(id: string) {
    this.router.navigate(['/answer-quiz/' + id]).then();
  }

  public get filterquiz() {
    return this.searchService.quizsSearch.value
  }

  protected readonly PaginationType = PaginationType;
}
