import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _adress_url: string = "https://api-adresse.data.gouv.fr/search/"
  private http =  inject(HttpClient);

  public async getAdress(address: string) {
    return this.http.get(this._adress_url + address)
  }

  public async getQuizzes(user_id: string) {
    const {data, error} = await supabase
      .from('quizzes')
      .select(`id,title,attempts_answers!inner(id,score,completed_at)`)
      .eq('user_id', user_id)

    if (error) {
      console.log("erreur sur l'insertion des attempts", error);
    }
    else {
      console.log('data',data)
    }

  }

}
