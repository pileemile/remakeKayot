import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {supabase} from '../../../environments/environment';
import {Level, LevelUser} from '../../models/level/level';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  public userLevel$ = new BehaviorSubject<LevelUser | null>(null);
  public levels$ = new BehaviorSubject<Level[] | []>([])

  public async getUserLevel(user_id: string) {
    const {data, error} = await supabase
      .from('user_levels')
      .select('*, levels(*)')
      .eq('user_id', user_id)
    if (error) {
      console.error("erreur lors de la récupération des données du level de l'utilisateur", error);
    }
    else {
      console.log("data level : ", data);
      this.userLevel$.next(data[0]);
    }
  }

  public async getAllLevels() {
    const {data, error} = await supabase
      .from('levels')
      .select('*')
      .order('level', { ascending: true });

    if (error) {
      console.error("erreur lors de la récupération des niveaux", error);
    }
    else {
      console.log("levels : ", data);
      this.levels$.next(data);
    }
  }
}
