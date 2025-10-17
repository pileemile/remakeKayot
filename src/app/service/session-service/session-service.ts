import { Injectable } from '@angular/core';
import {Session} from '@supabase/supabase-js';
import {BehaviorSubject} from 'rxjs';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public session$ = new BehaviorSubject<Session | null>(null);

  public async getSession(access_token: string, refresh_token: string) {
    await supabase.auth.setSession({
      access_token,
      refresh_token
    })
  }
}
