import { Routes } from '@angular/router';
import {Login} from './page/login/login';
import {Pin} from './page/pin/pin';
import {Quizz} from './page/quizz/quizz';

export const routes: Routes = [
  {
    path:'',
    component: Pin
  }
  ,{
    path: 'login',
    component: Login,
  },
  {
    path: 'quizz',
    component: Quizz,
  }
];
