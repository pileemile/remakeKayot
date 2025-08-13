import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Login} from '../../models/login/login';
import {supabase} from '../../../environments/environment';
import {SessionService} from '../session-service/session-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public login$ = new BehaviorSubject<Login | null>(null);
  public forgotPassword$ = new BehaviorSubject<Login | null>(null);
  public updateUser$ = new BehaviorSubject<Login | null>(null);
  public user_create_at: string | number | Date = "";

  private isAuthentificated = false;

  constructor(
    private sessionService: SessionService,
  ) {}

  public async loginSigUp(login: Login) {
    let { data, error } = await supabase.auth.signUp({
      email: this.login$.value?.email ?? '',
      password: this.login$.value?.password ?? '',
    })
    if (error) {
      console.log("erreur sur l'inscription", error);
    }
  }

  public async loginSigIn(login : Login ){
    let { data, error } = await supabase.auth.signInWithPassword({
      email: this.login$.value?.email ?? '',
      password: this.login$.value?.password ?? '',
    })
    if (error) {
      console.log("erreur sur la connexion", error);
    } else {
      await this.sessionService.getSession(data.session?.access_token ?? '', data.session?.refresh_token ?? '')
      this.isAuthentificated = true;
      if (data.user)
      this.user_create_at = data.user.created_at;
    }

  }

  public async forgotPassword(login: Login) {
    const email = this.login$.value?.email ?? '';
    let { data, error } = await supabase.auth.resetPasswordForEmail(
        email
    )
    if (error){
      console.log("erreur sur le reset de mot de passe", error);
    } else
      console.log('mot de passe reset');
  }


  public async updateUser(login: Login) {
    const { data, error } = await supabase.auth.updateUser({
      email: this.updateUser$.value?.email,
      password: this.updateUser$.value?.password,
    })
    if (error){
      console.log('erreur sur le nouveau mot de passe', data);
    } else
      console.log('nouveau mot de passe');
  }

 public isAuthenticated(): boolean {
    return this.isAuthentificated;
  }
}



