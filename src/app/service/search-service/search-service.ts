import { Injectable } from '@angular/core';
import {SearchQuizzesInterface, SearchUsersInterface} from '../../models/search/search';
import {supabase} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {Quizzes} from '../../models/quizzes/quizzes';
import {UserModele} from '../../models/user/user-modele';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public quizsSearch = new BehaviorSubject<Quizzes[] | null>(null)

  public async searchQuizzes(search: SearchQuizzesInterface) {
    let query = supabase
      .from('quizzes')
      .select('*');
    if (search.category) {
      query = query.eq('category', search.category);
    }
    if (search.difficulty) {
      query = query.eq('difficulty', search.difficulty);
    }
    if (search.created_at && search.finish_at) {
      const startDate = new Date(search.created_at).toISOString();
      const endDate = new Date(search.finish_at + 'T23:59:59.999Z').toISOString();

      query = query
        .gte('created_at', startDate)
        .lte('created_at', endDate);
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

  public async searchUser(search: SearchUsersInterface) {
    let query = supabase.from('user_roles').select('*');
    for (const key in search) {
      if (search[key as keyof SearchUsersInterface]) {
        switch (key) {
          case 'first_name':
          case 'last_name':
          case 'adress':
          case 'ville':
          case 'cp':
            query = query.ilike(key, `%${search[key as keyof SearchUsersInterface]}%`);
            break;
          case 'role':
            query = query.eq(key, search[key as keyof SearchUsersInterface]);
            break;
        }
      }
    }

    const { data, error } = await query;
    console.log("data", data);

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

}
