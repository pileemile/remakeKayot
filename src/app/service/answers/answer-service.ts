import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Answers} from '../../models/answer/answer';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  public answersAll$ = new BehaviorSubject<Answers[] |null>(null);




}
