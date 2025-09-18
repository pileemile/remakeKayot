import {Component} from '@angular/core';
import {CreateQuizz} from '../../component/quiz/create-quizz/create-quizz';
import {AllQuizzes} from '../../component/quiz/all-quizzes/all-quizzes';
import {SearchComponent} from '../../component/search/search-component/search-component';
import {Tabs} from '../../component/tabs/tabs/tabs';
import {ButtonEnum, ITabsMode} from '../../component/tabs/constants';
import {QuizFilter} from '../../component/quiz/quiz-filter/quiz-filter';
import {QuizService} from '../../service/quiz/quiz-service';

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

  constructor(
    public quizzesService: QuizService
  ) {}

  public get tabsConfiguration(): ITabsMode {
    return {[ButtonEnum.ALL]: true, [ButtonEnum.CREATE]: true, [ButtonEnum.SEARCH]: true, }
  }

  public get activePage(): ButtonEnum | undefined {
    return this.quizzesService.pageActive;
  }

  public set activePage(value: ButtonEnum | undefined) {
    this.quizzesService.pageActive = value;
  }

  public activationPage(event: ButtonEnum) {
    this.activePage = event;
  }

  public onSearchActivated(buttonEnum: ButtonEnum) {
    this.activePage = buttonEnum;
  }
}
