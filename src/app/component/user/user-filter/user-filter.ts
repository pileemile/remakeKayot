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
    { key: 'first_name', label: 'Prenom', type: 'text' },
    { key: 'last_name', label: 'Nom', type: 'text' },
    { key: 'adress', label: 'Adresse', type: 'text' },
    { key: 'cp', label: 'Code Postale', type: 'text' },
    { key: 'ville', label: 'Ville', type: 'text' },
  ];

  public get filterquiz() {
    return this.searchService.quizsSearch.value
  }
}
