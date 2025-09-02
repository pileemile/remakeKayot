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
  public quizeFilter = new BehaviorSubject<Quizzes[] | null>(null)
  public userFilter = new BehaviorSubject<UserModele[] | null>(null)

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

    this.quizeFilter.next(data);

    return data;
  }

  public async searchUser(search: SearchUsersInterface) {
    let query = supabase
      .from('user_roles')
      .select('*');
    if (search.first_name) {
      query = query.ilike('first_name', `%${search.first_name}%`);
    }
    if (search.last_name) {
      query = query.ilike('last_name', `%${search.last_name}%`);
    }
    if (search.adress) {
      query = query.ilike('adress', `%${search.adress}%`);
    }
    if (search.role) {
      query = query.eq('role', search.role);
    }
    if (search.cp) {
      query = query.ilike('cp', `%${search.cp}%`);
    }
    if (search.ville) {
      query = query.ilike('ville', `%${search.ville}%`);
    }

    const { data, error } = await query;
    console.log("data", data)

    if (error) {
      console.error(error);
      throw error;
    }

    this.userFilter.next(data);

    return data;

  }
}
