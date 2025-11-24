  import { Injectable } from '@angular/core';
  import { Pagination } from '../../models/pagination/pagination';
  import { supabase } from '../../../environments/environment';
  import { QuizService } from '../quiz/quiz-service';
  import { UserService } from '../user/user';
  import {SearchService} from '../search-service/search-service';
  import {firstValueFrom, filter, take, BehaviorSubject} from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class PaginationService {
    public pagination$ = new BehaviorSubject<Pagination | null>(null);

    constructor(
      private readonly quizService: QuizService,
      private readonly userService: UserService,
      private readonly searchService: SearchService,
    ) {}

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

        const start = (page - 1) * limit;
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

    async paginationUserQuiz(page: number, limit: number, userId: string): Promise<void> {
      try {
        const allUserQuizzes = await firstValueFrom(
          this.userService.userByQuiz.pipe(
            filter(quizzes => quizzes !== null && quizzes.length > 0),
            take(1)
          )
        );
        if (!allUserQuizzes) {
          console.error("Aucun quiz trouvé");
          return;
        }

        const start = page;
        const end = start +10;

        const safeStart = Math.min(start, allUserQuizzes.length);
        const paginatedQuizzes = allUserQuizzes.slice(safeStart, end);

        console.log("DEBUG Pagination:", {
          page,
          start,
          end,
          count: paginatedQuizzes.length,
          total: allUserQuizzes.length
        });

        this.quizService.allQuizs$.next(paginatedQuizzes);
        this.pagination$.next({
          page: page + 1,
          limit,
          total: allUserQuizzes.length,
        });
      } catch (error) {
        console.error('Erreur:', error);
        this.quizService.allQuizs$.next([]);
      }
    }
  }
