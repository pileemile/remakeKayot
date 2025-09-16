import {inject, Injectable} from '@angular/core';
import {Pagination} from '../../models/pagination/pagination';
import {environment, supabase} from '../../../environments/environment';
import {QuizzesService} from '../quizzes/quizzes-service';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from '../user/user';
import {HttpClient} from '@angular/common/http';
import {Quizzes} from '../../models/quizzes/quizzes';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private http = inject(HttpClient);

  constructor(
    private quizzesService: QuizzesService,
    private userService: UserService,
  ) {}

  public pagination$ = new BehaviorSubject<Pagination>({
    page: 0,
    limit: 10,
  })

  public async paginationQuizzes(page: number | undefined, limit: number | undefined) {
    if (page != null && limit != null) {
        let {data: quizzes, error} = await supabase
          .from('quizzes')
          .select('*, questions(*)')
          .range(page, limit)
      this.quizzesService.allQuizs$.next(quizzes);
      console.log("all quizzes", quizzes)
    }
    else {
      console.log("erreur sur la pagination")
    }
  }

  public async paginationUser(page: number | undefined, limit: number | undefined) {
    if (page != null && limit != null) {
      let {data: user, error} = await supabase
        .from('user_roles')
        .select('*')
        .range(page, limit)
      this.userService.allUser.next(user);
      console.log("all quizzes", user)
    }
    else {
      console.log("erreur sur la pagination")
    }
  }
}
