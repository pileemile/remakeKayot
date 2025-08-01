import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Login} from '../../models/login/login';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public login$ = new BehaviorSubject<Login | null>(null);
  public forgotPassword$ = new BehaviorSubject<Login | null>(null);
  public updateUser$ = new BehaviorSubject<Login | null>(null);

  public async loginSigUp(login: Login) {
    let { data, error } = await supabase.auth.signUp({
      email: this.login$.value?.email ?? '',
      password: this.login$.value?.password ?? '',
    })
    if (error) {
      console.log("erreur sur l'inscription", error);
    } else
      console.log("donnée enregistrée :");
  }

  public async loginSigIn(login : Login ){
    let { data, error } = await supabase.auth.signInWithPassword({
      email: this.login$.value?.email ?? '',
      password: this.login$.value?.password ?? '',
    })
    if (error) {
      console.log("erreur sur la connexion", error);
    } else
      console.log("connecté !!!")

  }

  public async forgotPassword(login: Login) {
    const email = this.login$.value?.email ?? '';
    console.log(email, 'whoa');
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
    console.log(this.updateUser$.value?.email, 'email')
    if (error){
      console.log('erreur sur le nouveau mot de passe', data);
    } else
      console.log('nouveau mot de passe');
  }
}



