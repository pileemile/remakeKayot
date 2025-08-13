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


 // public async insertAttempt(attempt: Attempts) {
 //
 //    const newAttempt: TablesInsert<'attempts'> = {
 //      quiz_id: this.attempts?.quiz_id ?? null,
 //      score: this.attempts?.score ?? null,
 //      total: this.attempts?.total ?? null,
 //      user_id: this.attempts?.user_id ?? null,
 //    }
 //
 //    const { data, error } = await supabase
 //      .from('attempts')
 //      .insert([
 //        newAttempt
 //      ])
 //      .select()
 //    if (error) {
 //      console.log("erreur sur l'insertion des attempts", error);
 //    }
 //
 //  }


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
