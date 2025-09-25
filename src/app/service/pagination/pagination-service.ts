  import { Injectable } from '@angular/core';
  import { Pagination } from '../../models/pagination/pagination';
  import { supabase } from '../../../environments/environment';
  import { QuizService } from '../quiz/quiz-service';
  import { BehaviorSubject } from 'rxjs';
  import { UserService } from '../user/user';
  import {SearchService} from '../search-service/search-service';

  @Injectable({
    providedIn: 'root'
  })
  export class PaginationService {

    constructor(
      private readonly quizService: QuizService,
      private readonly userService: UserService,
      private readonly searchService: SearchService,
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
        const allFilteredQuizs = this.searchService.quizsSearch.value;

        if (!allFilteredQuizs) {
          console.warn("Aucun quiz filtré trouvé dans quizsSearch");
          return;
        }

        const start = page * limit;
        const end = start + limit;
        const paginatedQuizs = allFilteredQuizs.slice(start, end);

        this.quizService.allQuizs$.next(paginatedQuizs);

        this.pagination$.next({
          page,
          limit,
          total: allFilteredQuizs.length,
        });

      } catch (error) {
        console.error('Erreur lors de la pagination des quiz filtrés:', error);
      }
    }


  }
