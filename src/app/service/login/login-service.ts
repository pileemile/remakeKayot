import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, lastValueFrom} from 'rxjs';
import {Login} from '../../models/login/login';
import {environment, supabase} from '../../../environments/environment';
import {SessionService} from '../session-service/session-service';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public login$ = new BehaviorSubject<Login | null>(null);
  public forgotPassword$ = new BehaviorSubject<Login | null>(null);
  public updateUser$ = new BehaviorSubject<Login | null>(null);
  public user_create_at: string | number | Date = "";

  private isAuthentificated = false;
  private http = inject(HttpClient);

  constructor(
    private sessionService: SessionService,
  ) {}

  public async loginSigUp(login: Login) {
    let { data, error } = await supabase.auth.signUp({
      email: this.login$.value?.email ?? '',
      password: this.login$.value?.password ?? '',
    })
    if (error) {
      console.error("erreur sur l'inscription", error);
    }
  }

  public async loginSigIn(login : Login ){
    let { data, error } = await supabase.auth.signInWithPassword({
      email: this.login$.value?.email ?? '',
      password: this.login$.value?.password ?? '',
    })
    if (error) {
      console.error("erreur sur la connexion", error);
    } else {
      await this.sessionService.getSession(data.session?.access_token ?? '', data.session?.refresh_token ?? '')
      this.isAuthentificated = true;
      if (data.user)
      this.user_create_at = data.user.created_at;
    }
  }

  public async loginSigInRest(login: Login) {

    const requestBody = {
      email: login.email,
      password: login.password
    };

    try {
      const data = await lastValueFrom(
        this.http.post<any>(
          `${environment.supabaseUrl}/auth/v1/token?grant_type=password`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              'apikey': environment.supabaseKey
            }
          }
        )
      );
      await this.storeSession(data);

      return data;
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  }
  private async storeSession(authData: any) {
    const { data, error } = await supabase.auth.setSession({
      access_token: authData.access_token,
      refresh_token: authData.refresh_token
    });

    if (error) {
      console.error('Erreur lors du stockage de session:', error);
    } else {
    }
  }

  public async forgotPassword(login: Login) {
    const email = this.login$.value?.email ?? '';
    let {data, error} = await supabase.auth.resetPasswordForEmail(
      email
    )
    if (error) {
      console.error("erreur sur le reset de mot de passe", error);
    }
  }

  public async updateUser(login: Login){
      const {data, error} = await supabase.auth.updateUser({
        email: this.updateUser$.value?.email,
        password: this.updateUser$.value?.password,
      })
      if (error) {
        console.error('erreur sur le nouveau mot de passe', data);
      }
  }

 public isAuthenticated(): boolean {
    return this.isAuthentificated;
  }

}



