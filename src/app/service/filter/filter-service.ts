import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IFilters} from '../../component/filter/constent';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public filterQuizzes = new BehaviorSubject< IFilters | null>(null);

  updateFilter(field: string, value: string | number) {
    const current = this.filterQuizzes.value || {};
    this.filterQuizzes.next({
      ...current,
      [field]: value
    });
  }
}
