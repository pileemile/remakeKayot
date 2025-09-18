import {Injectable} from '@angular/core';
import {Pagination} from '../../models/pagination/pagination';
import {supabase} from '../../../environments/environment';
import {QuizService} from '../quiz/quiz-service';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(
    private readonly quizzesService: QuizService,
    private readonly userService: UserService,
  ) {}

  public pagination$ = new BehaviorSubject<Pagination>({
    page: 0,
    limit: 10,
  })

  public async paginationQuizzes(page: number | undefined, limit: number | undefined) {
    if (page != null && limit != null) {
        let {data: quizzes} = await supabase
          .from('quizzes')
          .select('*, questions(*)')
          .range(page, limit)
      this.quizzesService.allQuizs$.next(quizzes);
      console.log("all quiz", quizzes)
    }
    else {
      console.log("erreur sur la pagination")
    }
  }

  public async paginationUser(page: number | undefined, limit: number | undefined) {
    if (page != null && limit != null) {
      let {data: user} = await supabase
        .from('user_roles')
        .select('*')
        .range(page, limit)
      this.userService.allUser.next(user);
      console.log("all quiz", user)
    }
    else {
      console.log("erreur sur la pagination")
    }
  }
}
