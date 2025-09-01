import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IFilter} from '../../component/filter/constent';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public filterQuizzes = new BehaviorSubject< IFilter | null>(null);

  updateFilter(field: string, value: string | number) {
    const current = this.filterQuizzes.value || {};
    this.filterQuizzes.next({
      ...current,
      [field]: value
    });
  }
}
