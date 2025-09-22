import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IFilters} from '../../component/filter/constent';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public filterQuiz = new BehaviorSubject< IFilters | null>(null);

  updateFilter(field: string, value: string | number) {
    const current = this.filterQuiz.value || {};
    this.filterQuiz.next({
      ...current,
      [field]: value
    });
  }
}
