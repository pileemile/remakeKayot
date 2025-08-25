import { Component } from '@angular/core';
import {CreateQuizz} from '../../component/quiz/create-quizz/create-quizz';
import {AllQuizzes} from '../../component/quiz/all-quizzes/all-quizzes';
import {SearchComponent} from '../../component/search/search-component/search-component';
import {Tabs} from '../../component/tabs/tabs/tabs';
import {ButtonEnum, ITabsMode} from '../../component/tabs/constants';
import {QuizFilter} from '../../component/quiz/quiz-filter/quiz-filter';

@Component({
  selector: 'app-quizz',
  imports: [
    CreateQuizz,
    AllQuizzes,
    SearchComponent,
    Tabs,
    QuizFilter,
  ],
  templateUrl: './quizz.html',
  styleUrl: './quizz.css'
})
export class Quizz {

  public ButtonEnum = ButtonEnum;
  public pageActive?: ButtonEnum;

  public get tabsConfiguration(): ITabsMode {
    return {[ButtonEnum.ALL]: true, [ButtonEnum.CREATE]: true, [ButtonEnum.SEARCH]: true, }
  }

  public activationPage(event: ButtonEnum) {
    this.pageActive = event;
  }

  public onFilterActivated(buttonEnum: ButtonEnum) {
    this.pageActive = buttonEnum;
  }
}
