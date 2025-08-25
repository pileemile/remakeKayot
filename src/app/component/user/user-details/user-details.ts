import { Component } from '@angular/core';
import {UserService} from '../../../service/user/user';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class UserDetails {
  constructor(
    private user: UserService
  ) {}

}
