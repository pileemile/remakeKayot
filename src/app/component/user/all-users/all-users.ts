import {Component} from '@angular/core';
import {UserService} from '../../../service/user/user';
import {Table} from '../../table/table';
import {TableColumn} from '../../../models/tables/tables-interface';
import {PaginationType} from '../../pagination/constent';
import {Pagination} from '../../pagination/pagination';

@Component({
  selector: 'app-all-users',
  imports: [
    Table,
    Pagination
  ],
  templateUrl: './all-users.html',
  styleUrl: './all-users.css'
})
export class AllUsers {
  protected readonly PaginationType = PaginationType;

  constructor(
    private readonly userService: UserService,
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

}
