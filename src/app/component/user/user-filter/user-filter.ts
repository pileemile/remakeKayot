import {Component} from '@angular/core';
import {Table} from "../../table/table";
import {SearchService} from '../../../service/search-service/search-service';
import {TableColumn} from '../../../models/tables/tables-interface';
import {Pagination} from '../../pagination/pagination';
import {PaginationType} from '../../pagination/constent';

@Component({
  selector: 'app-user-filter',
  imports: [
    Table,
    Pagination
  ],
  templateUrl: './user-filter.html',
  styleUrl: './user-filter.css'
})
export class UserFilter {
  protected readonly PaginationType = PaginationType;

  constructor(
    private readonly searchService: SearchService,
  ) {}

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
