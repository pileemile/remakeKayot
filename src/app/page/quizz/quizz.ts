import { Component } from '@angular/core';
import {CreateQuizz} from '../../component/quiz/create-quizz/create-quizz';
import {AllQuizzes} from '../../component/quiz/all-quizzes/all-quizzes';
import {SearchComponent} from '../../component/search/search-component/search-component';
import {Tabs} from '../../component/tabs/tabs/tabs';
import {QuizzesService} from '../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-quizz',
  imports: [
    CreateQuizz,
    AllQuizzes,
    SearchComponent,
    Tabs
  ],
  templateUrl: './quizz.html',
  styleUrl: './quizz.css'
})
export class Quizz {
  constructor(
    public quizzesService: QuizzesService,
  ) {}

  public get activeTab() {
    return this.quizzesService.activeTab;
  }
}
