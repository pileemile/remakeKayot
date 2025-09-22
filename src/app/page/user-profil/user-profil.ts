import { Component } from '@angular/core';
import {UserDetails} from '../../component/user/user-details/user-details';
import {Table} from '../../component/table/table';
import {UserService} from '../../service/user/user';
import {TableColumn} from '../../models/tables/tables-interface';
import {UserComments} from '../../component/user/user-comments/user-comments';

@Component({
  selector: 'app-user-profil',
  imports: [
    UserDetails,
    Table,
    UserComments
  ],
  templateUrl: './user-profil.html',
  styleUrl: './user-profil.css'
})
export class UserProfil {

  public tableColumns: TableColumn[] = [
    { key: 'title', label: 'Titre', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'difficulty', label: 'Difficulty', type: 'text' },
  ];

  constructor(
    private readonly userService: UserService
  ) {}

  public get userQuiz() {
    return this.userService.userByQuiz.value;
  }



}
