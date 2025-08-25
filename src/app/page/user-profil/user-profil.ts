import { Component } from '@angular/core';
import {UserDetails} from '../../component/user/user-details/user-details';
import {Table} from '../../component/table/table';

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

}
