import {Component} from '@angular/core';
import {UserParameter} from '../user/user-parameter/user-parameter';
import {UserNotification} from '../user/user-notification/user-notification';

@Component({
  selector: 'app-header',
  imports: [
    UserParameter,
    UserNotification

  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
