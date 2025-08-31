import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IFilter} from '../../component/filter/constent';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public filterQuzzes = new BehaviorSubject< IFilter | null>(null);
}
