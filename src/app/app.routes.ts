import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { Quizz } from './page/quizz/quizz';
import {AuthGuard} from './auth.guard';
import {AnswerQuiz} from './page/answer-quiz/answer-quiz';
import {Dashboard} from './page/dashboard/dashboard';
import {QuizFilter} from './component/quiz/quiz-filter/quiz-filter';

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
    // canActivate: [AuthGuard]
  },
  {
    path:'all-quizzes',
    component:Quizz,
    // canActivate: [AuthGuard]
  },
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
];
