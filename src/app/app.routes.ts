import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { Pin } from './page/pin/pin';
import { Quizz } from './page/quizz/quizz';
import {SeeAllQuizzes} from './page/see-all-quizzes/see-all-quizzes';
import {AuthGuard} from './auth.guard';
import {Timer} from './component/timer/timer';
import {AnswerQuiz} from './page/answer-quiz/answer-quiz';

export const routes: Routes = [
  {
    path: 'pin',
    component: Pin,
    canActivate: [AuthGuard]
  },
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
    canActivate: [AuthGuard]
  },
  {
    path: 'answer-quiz',
    component: AnswerQuiz
  }
];
