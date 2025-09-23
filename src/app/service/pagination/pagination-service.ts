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
  private readonly currentQuizFilters: any = {};

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

      const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select('*, questions(*)')
        .range(page, page + limit - 1);

      if (error) {
        console.error('Erreur lors de la récupération des quizzes:', error);
        return;
      }

      this.quizService.allQuizs$.next(quizzes);

      this.pagination$.next({
        page,
        limit,
        total: totalCount || 0
      });

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

    } catch (error) {
      console.error('Erreur lors de la pagination des utilisateurs:', error);
    }
  }

  public async paginationQuizFilter(page: number, limit: number): Promise<void> {
    try {
      let query = supabase
        .from('quizzes')
        .select('*, questions(*)', { count: 'exact', head: true });

      switch (this.currentQuizFilters?.type) {
        case 'difficulty':
          query = query.eq('difficulty', this.currentQuizFilters.value);
          break;
        case 'category':
          query = query.eq('category', this.currentQuizFilters.value);
          break;
        case 'isActive':
          query = query.eq('is_active', this.currentQuizFilters.value);
          break;
        case 'title':
          query = query.ilike('title', `%${this.currentQuizFilters.value}%`);
          break;
        default:
          console.error("Filtre invalide: ", this.currentQuizFilters);
          break;
      }


      const { count: totalCount, error: countError } = await query;
      if (countError) throw countError;

      const { data: quizzes, error } = await query.range(
        page * limit,
        page * limit + limit - 1
      );

      if (error) {
        console.error('Erreur lors de la récupération des quizzes filtrés:', error);
        return;
      }

      this.quizService.allQuizs$.next(quizzes);

      this.pagination$.next({
        page,
        limit,
        total: totalCount || 0,
      });

      console.log("Quizzes filtrés paginés:", quizzes);
      console.log("Total quizzes filtrés:", totalCount);
      console.log("Filtres appliqués:", this.currentQuizFilters);

    } catch (error) {
      console.error('Erreur lors de la pagination des quizzes filtrés:', error);
    }
  }

}
