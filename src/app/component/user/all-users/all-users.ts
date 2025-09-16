import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user';
import {Pagination} from '../../pagination/pagination';
import {Table} from '../../table/table';
import {TableColumn} from '../../../models/tables/tables-interface';
import {PaginationType} from '../../pagination/constent';

@Component({
  selector: 'app-all-users',
  imports: [
    Pagination,
    Table
  ],
  templateUrl: './all-users.html',
  styleUrl: './all-users.css'
})
export class AllUsers {

  constructor(
    private userService: UserService,
  ) {}

  public tableColumns: TableColumn[] = [
    { key: 'first_name', label: 'Prenom', type: 'text' },
    { key: 'last_name', label: 'Nom', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'ville', label: 'Ville', type: 'text' },
    { key: 'cp', label: 'Code Postal', type: 'text' },
  ];

  public get allUsers() {
    return this.userService.allUser.value
  }

  protected readonly PaginationType = PaginationType;
}
