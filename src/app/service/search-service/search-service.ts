import { Injectable } from '@angular/core';
import {SearchInterface} from '../../models/search/search';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public async search(search: SearchInterface) {
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
      // Convertir les dates pour être ISO avec Supabase
      const startDate = new Date(search.created_at).toISOString();
      const endDate = new Date(search.finish_at + 'T23:59:59.999Z').toISOString();

      query = query
        .gte('created_at', startDate)
        .lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  }
}
