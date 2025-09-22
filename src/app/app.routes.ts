import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { Quiz } from './page/quiz/quiz';
import {AnswerQuiz} from './page/answer-quiz/answer-quiz';
import {Dashboard} from './page/dashboard/dashboard';
import {QuizFilter} from './component/quiz/quiz-filter/quiz-filter';
import {Users} from './page/users/users';
import {UserProfil} from './page/user-profil/user-profil';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
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
    path:'all-quiz',
    component:Quiz,
    // can0Activate: [AuthGuard]
  },
  // TODO ajuster la convention de nommage
  {
    path:'quiz-filter',
    component:QuizFilter
  },
  {
    path: 'answer-quiz/:id',
    component: AnswerQuiz,
    // canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'users',
    component: Users,
  },
  {
    path:'user-profil',
    component:UserProfil
    //:id
  }
];
