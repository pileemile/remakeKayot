import {Injectable} from '@angular/core';
import {supabase} from '../../../environments/environment';
import {UserModele} from '../../models/user/user-modele';
import {BehaviorSubject} from 'rxjs';
import {TablesUpdate} from '../../../environments/supabase';
import {Quiz} from '../../models/quiz/quiz';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userByQuiz = new BehaviorSubject<Quiz[] | null>(null)
  public getUser: UserModele | null = null;
  public editUser = new BehaviorSubject<UserModele | null>(null);
  public allUser = new BehaviorSubject<UserModele[] | null>(null);

  public async getUserById(user_id: string) {
    const {data, error} = await supabase
      .from('user_roles')
      .select(`*`)
      .eq('user_id', user_id)
      .maybeSingle<UserModele>();
    if (error) {
      console.error("erreur sur le user", error);
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
      console.error("erreur sur l'insertion des attempts", error);
    }
  }

  public async getQuizByUserId(user_id: string) {
    const {data, error} = await supabase
      .from('attempt_answers')
      .select(`quizzes!inner(*)`)
      .eq('user_id', user_id)

    if (error) {
      console.error("erreur sur ", error);
    } else {
      const dataTable: Quiz[] = [];
      data?.forEach(item => {
        if (Array.isArray(item.quizzes)) {
          item.quizzes.forEach(quiz => dataTable.push(quiz));
        } else if (item.quizzes) {
          dataTable.push(item.quizzes);
        }
      });

      this.userByQuiz.next(dataTable);
    }
  }

}
