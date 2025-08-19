import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { Quizz } from './page/quizz/quizz';
import {SeeAllQuizzes} from './page/see-all-quizzes/see-all-quizzes';
import {AuthGuard} from './auth.guard';
import {AnswerQuiz} from './page/answer-quiz/answer-quiz';
import {Dashboard} from './page/dashboard/dashboard';
import {Drawer} from './component/drawer/drawer';

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
    path: 'quizz',
    component: Quizz,
  },
  {
    path:'all-quizzes',
    component:SeeAllQuizzes,
    // canActivate: [AuthGuard]
  },
  {
    path: 'answer-quiz',
    component: AnswerQuiz,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
];
