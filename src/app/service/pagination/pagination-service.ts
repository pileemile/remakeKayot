import { Injectable } from '@angular/core';
import { Pagination } from '../../models/pagination/pagination';
import { supabase } from '../../../environments/environment';
import { QuizService } from '../quiz/quiz-service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(
    private readonly quizService: QuizService,
    private readonly userService: UserService,
  ) {}

  public pagination$ = new BehaviorSubject<Pagination | null>(null);

  public async paginationQuiz(page: number, limit: number): Promise<void> {
    try {
      const { count: totalCount } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true });

      const { data: quiz, error } = await supabase
        .from('quizzes')
        .select('*, questions(*)')
        .range(page, page + limit - 1);

      if (error) {
        console.error('Erreur lors de la récupération des quiz:', error);
        return;
      }

      this.quizService.allQuizs$.next(quiz);

      this.pagination$.next({
        page,
        limit,
        total: totalCount || 0
      });

      console.log("Quiz paginés:", quiz);
      console.log("Total quiz:", totalCount);
    } catch (error) {
      console.error('Erreur lors de la pagination des quiz:', error);
    }
  }

  public async paginationUser(page: number, limit: number): Promise<void> {
    try {
      const { count: totalCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      const { data: users, error } = await supabase
        .from('user_roles')
        .select('*')
        .range(page, page + limit - 1);

      if (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return;
      }

      this.userService.allUser.next(users);

      this.pagination$.next({
        page,
        limit,
        total: totalCount || 0
      });

      console.log("Utilisateurs paginés:", users);
      console.log("Total utilisateurs:", totalCount);
    } catch (error) {
      console.error('Erreur lors de la pagination des utilisateurs:', error);
    }
  }
}
