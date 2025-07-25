import { Component } from '@angular/core';
import {ComponentLogin} from '../../component/component-login/component-login';

@Component({
  selector: 'app-login',
  imports: [
    ComponentLogin
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
