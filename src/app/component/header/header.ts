import {Component} from '@angular/core';
import {UserParameter} from '../user/user-parameter/user-parameter';

@Component({
  selector: 'app-header',
  imports: [
    UserParameter

  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
