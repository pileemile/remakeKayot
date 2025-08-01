import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { Pin } from './page/pin/pin';
import { Quizz } from './page/quizz/quizz';
import {SeeAllQuizzes} from './page/see-all-quizzes/see-all-quizzes';

export const routes: Routes = [
  {
    path: '',
    component: Pin
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: Login,
        data: { authMode: 'login' }
      },
      {
        path: 'register',
        component: Login,
        data: { authMode: 'register' }
      },
      {
        path: 'reset-password',
        component: Login,
        data: { authMode: 'reset' }
      }
    ]
  },
  {
    path: 'quizz',
    component: Quizz,
  },
  {
    path:'all-quizzes',
    component:SeeAllQuizzes,
  },
];
