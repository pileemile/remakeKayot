import { Component } from '@angular/core';
import {Pagination} from "../../pagination/pagination";
import {Table} from "../../table/table";
import {PaginationService} from '../../../service/pagination/pagination-service';
import {SearchService} from '../../../service/search-service/search-service';
import {TableColumn} from '../../../models/tables/tables-interface';

@Component({
  selector: 'app-user-filter',
    imports: [
        Pagination,
        Table
    ],
  templateUrl: './user-filter.html',
  styleUrl: './user-filter.css'
})
export class UserFilter {

  constructor(
    private paginationService: PaginationService,
    private searchService: SearchService,
  ) {}

  async ngOnInit() {
    await this.paginationService.paginationQuizzes(this.paginationService.pagination$.value?.page, this.paginationService.pagination$.value?.limit);
  }

  public tableColumns: TableColumn[] = [
    { key: 'title', label: 'Titre', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'difficulty', label: 'Difficulty', type: 'text' },
  ];

  public get filterquiz() {
    return this.searchService.quizeFilter.value
  }
}
