import { Injectable } from '@angular/core';
import {supabase} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {Quiz} from '../../models/quiz/quiz';
import {IFilters} from '../../component/filter/constent';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  public quizsSearch = new BehaviorSubject<Quiz[] | null>(null)

  public async searchQuiz(search: IFilters | null) {
    let query = supabase
      .from('quizzes')
      .select('*');
    if (search) {
      if (search.category) {
        query = query.eq('category', search.category);
      }
      if (search.difficulty) {
        query = query.eq('difficulty', search.difficulty);
      }
      if (search.created_at && search.finish_at) {
        const startDate = new Date(search.created_at + 'T23:59:59.999Z').toISOString();
        const endDate = new Date(search.finish_at + 'T23:59:59.999Z').toISOString();
        console.log(startDate, endDate);
        query = query
          .gte('created_at', startDate)
          .lte('created_at', endDate);
      }

    }
    const { data, error } = await query;
    console.log("data", data)

    if (error) {
      console.error(error);
      throw error;
    }

    this.quizsSearch.next(data);

    return data;
  }

  public async searchUser(search: IFilters | null) {
    let query = supabase.from('user_roles').select('*');

    if (search) {
      const filterMap:Partial<Record<keyof IFilters, 'ilike' | 'eq'>> = {
        first_name: 'ilike',
        last_name: 'ilike',
        adress: 'ilike',
        city: 'ilike',
        cp: 'ilike',
        role: 'eq',
      };
      Object.entries(search).forEach(([key, value]) => {
        if (value) {
          const filterType = filterMap[key as keyof IFilters];
          if (filterType === 'ilike') {
            query = query.ilike(key, `%${value}%`);
          } else {
            query = query.eq(key, value);
          }
        }
      });
    }

    const { data, error } = await query;
    console.log("data", data);

    if (error) {
      console.error(error);
      throw error;
    }
    this.quizsSearch.next(data);

    return data;
  }
}
