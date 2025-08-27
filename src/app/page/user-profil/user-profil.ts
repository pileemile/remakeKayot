import { Component } from '@angular/core';
import {UserDetails} from '../../component/user/user-details/user-details';
import {Table} from '../../component/table/table';
import {UserService} from '../../service/user/user';
import {TableColumn} from '../../models/tables/tables-interface';

@Component({
  selector: 'app-user-profil',
  imports: [
    UserDetails,
    Table
  ],
  templateUrl: './user-profil.html',
  styleUrl: './user-profil.css'
})
export class UserProfil {

  public tableColumns: TableColumn[] = [
    { key: 'title', label: 'Titre' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'difficulty', label: 'Difficulty' },
  ];

  constructor(
    private userService: UserService
  ) {}

  public get userQuizzes() {
    return this.userService.userByQuizzes.value;
  }



}
