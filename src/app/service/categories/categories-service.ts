import { Injectable } from '@angular/core';
import {Categories} from '../../models/categories/categories';
import {supabase} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  public categories: Categories[] = [];

  public async getAllCategories() {
    const {data, error} = await supabase
      .from('categories')
      .select('*')

    if (error) {
      console.error("erreur sur les categories", error);
    }
    this.categories = data || [];

    console.log("categories : ", this.categories);
  }

  public get category(): Categories[] {
    return this.categories;
  }
}
