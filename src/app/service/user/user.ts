import {Injectable} from '@angular/core';
import {supabase} from '../../../environments/environment';
import {UserModele} from '../../models/user/user-modele';
import {BehaviorSubject} from 'rxjs';
import {TablesUpdate} from '../../../environments/supabase';
import {Quiz} from '../../models/quizzes/quizzes';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userByQuizzes = new BehaviorSubject<Quiz[] | null>(null)
  public getUser: UserModele | null = null;
  public editUser = new BehaviorSubject<UserModele | null>(null);
  public allUser = new BehaviorSubject<UserModele[] | null>(null);

  public async getQuizzes(user_id: string) {
    const {data, error} = await supabase
      .from('quizzes')
      .select(`id,title,attempts_answers!inner(id,score,completed_at)`)
      .eq('user_id', user_id)

    if (error) {
      console.log("erreur sur l'insertion des attempts", error);
    } else {
      console.log('data', data)
    }
  }

  public async getUserById(user_id: string) {
    const {data, error} = await supabase
      .from('user_roles')
      .select(`*`)
      .eq('user_id', user_id)
      .maybeSingle<UserModele>();
    if (error) {
      console.log("erreur sur le user", error);
    } else {
      this.getUser = data;
    }
  }

  public async updateUser(user: UserModele, user_id: string) {

    const updateUser: TablesUpdate<'user_roles'> = {
      first_name: this.editUser.value?.first_name ?? user.first_name,
      last_name: this.editUser.value?.last_name ?? user.last_name,
      adress: this.editUser.value?.adress ?? user.adress,
      ville: this.editUser.value?.ville ?? user.ville,
      cp: this.editUser.value?.cp ?? user.cp,
    }

    const {data, error} = await supabase
      .from('user_roles')
      .update(updateUser)
      .eq('user_id', user_id)
      .select()

    if (error) {
      console.log("erreur sur l'insertion des attempts", error);
    } else {
      console.log('data', data)
    }
  }

  public async getQuizzesByUserId(user_id: string) {
    const {data, error} = await supabase
      .from('attempt_answers')
      .select(`quizzes!inner(*)`)
      .eq('user_id', user_id)

    if (error) {
      console.log("erreur sur ", error);
    } else {
      console.log('data', data)

      const dataTable: Quiz[] = [];
      data?.forEach(item => {
        if (Array.isArray(item.quizzes)) {
          item.quizzes.forEach(quiz => dataTable.push(quiz));
        } else if (item.quizzes) {
          dataTable.push(item.quizzes);
        }
      });

      this.userByQuizzes.next(dataTable);
      console.log("user by quiz", this.userByQuizzes.value)
    }
  }

  public async getUserRoleALl() {
    const {data: user, error} = await supabase
      .from('user_roles')
      .select(`*`)

    if (error) {
      console.log("erreur sur le user", error);
    } else {
      this.allUser.next(user);
      console.log('data', user)
    }
  }

}
