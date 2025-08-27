import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user';

@Component({
  selector: 'app-user-parameter',
  imports: [],
  templateUrl: './user-parameter.html',
  styleUrl: './user-parameter.css'
})
export class UserParameter{

  constructor(
    private userService: UserService,
  ){}


}
