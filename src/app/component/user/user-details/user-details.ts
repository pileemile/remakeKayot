import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class UserDetails implements OnInit{

  id_user:string = '22ce5a89-1db2-46e7-a265-c929697ff1d0';

  constructor(
    private userService: UserService
  ) {}

  async ngOnInit() {
    await this.userService.getUserById(this.id_user);

  }

  public get user() {
    return this.userService.getUser
  }

}
