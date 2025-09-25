import { Injectable } from '@angular/core';
import {supabase} from '../../../environments/environment';
import {Attempts} from '../../models/attempts/attempts';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttemptsService {
  public attemptsAllWithUser$ = new BehaviorSubject<Attempts[] | null>(null);
  public attempts: Attempts | null = null

  public async getAttempts(user_id: string | undefined) {

    let { data: attempts, error } = await supabase
      .from('attempts')
      .select('*')
      .eq('user_id', user_id)
    if (error) {
      console.log("erreur sur l'insertion des attempts", error);
    }
    else {
      this.attemptsAllWithUser$.next(attempts);
    }
  }
}
