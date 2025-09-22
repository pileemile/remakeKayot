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
  private currentQuizFilters: any = {};

  constructor(
    private readonly quizService: QuizService,
    private readonly userService: UserService,
  ) {}

  public pagination$ = new BehaviorSubject<Pagination | null>(null);

  public async paginationQuizzes(page: number, limit: number): Promise<void> {
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

      console.log("Quizzes paginés:", quizzes);
      console.log("Total quizzes:", totalCount);
    } catch (error) {
      console.error('Erreur lors de la pagination des quizzes:', error);
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

  public setQuizFilters(filters: any): void {
    this.currentQuizFilters = filters;
  }

  public getCurrentQuizFilters(): any {
    return this.currentQuizFilters;
  }

  public async paginationQuizFilter(page: number, limit: number): Promise<void> {
    try {
      let query = supabase
        .from('quizzes')
        .select('*, questions(*)', { count: 'exact' });

      if (this.currentQuizFilters) {
        if (this.currentQuizFilters.title) {
          query = query.ilike('title', `%${this.currentQuizFilters.title}%`);
        }
        if (this.currentQuizFilters.category) {
          query = query.eq('category', this.currentQuizFilters.category);
        }
        if (this.currentQuizFilters.difficulty) {
          query = query.eq('difficulty', this.currentQuizFilters.difficulty);
        }
        if (this.currentQuizFilters.isActive !== undefined) {
          query = query.eq('is_active', this.currentQuizFilters.isActive);
        }
      }

      const { count: totalCount } = await query;

      const { data: quizzes, error } = await query
        .range(page, page + limit - 1);

      if (error) {
        console.error('Erreur lors de la récupération des quizzes filtrés:', error);
        return;
      }

      this.quizService.allQuizs$.next(quizzes);

      this.pagination$.next({
        page,
        limit,
        total: totalCount || 0
      });

      console.log("Quizzes filtrés paginés:", quizzes);
      console.log("Total quizzes filtrés:", totalCount);
      console.log("Filtres appliqués:", this.currentQuizFilters);
    } catch (error) {
      console.error('Erreur lors de la pagination des quizzes filtrés:', error);
    }
  }
}
