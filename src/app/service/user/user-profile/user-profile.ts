import { Injectable } from '@angular/core';
import {supabase} from '../../../../environments/environment';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfile {
  public userProfile = new BehaviorSubject<UserProfile[] >([]);

  public async getUserProfile(user_id: string) {
    const {data, error} = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user_id)
    if (error) {
      console.error("erreur sur le user", error);
    }
    else {
      console.log("récupération du user : ", data)
      this.userProfile.next(data)
    }
  }
}
