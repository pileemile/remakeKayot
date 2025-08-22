import { Component } from '@angular/core';
import {CreateQuizz} from '../../component/quiz/create-quizz/create-quizz';
import {AllQuizzes} from '../../component/quiz/all-quizzes/all-quizzes';
import {SearchComponent} from '../../component/search/search-component/search-component';
import {Tabs} from '../../component/tabs/tabs/tabs';
import {QuizzesService} from '../../service/quizzes/quizzes-service';
import {ButtonEnum, ITabsMode} from '../../component/tabs/constants';

@Component({
  selector: 'app-quizz',
  imports: [
    CreateQuizz,
    AllQuizzes,
    SearchComponent,
    Tabs,
  ],
  templateUrl: './quizz.html',
  styleUrl: './quizz.css'
})
export class Quizz {

  public ButtonEnum = ButtonEnum;
  public pageActive?: ButtonEnum;

  public get tabsConfiguration(): ITabsMode {
    return {[ButtonEnum.ALL]: true, [ButtonEnum.CREATE]: true, [ButtonEnum.SEARCH]: true}
  }

  public activationPage(event: ButtonEnum) {
    this.pageActive = event;
  }

}
