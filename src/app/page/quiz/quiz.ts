import {Component} from '@angular/core';
import {CreateQuiz} from '../../component/quiz/create-quiz/create-quiz';
import {AllQuiz} from '../../component/quiz/all-quiz/all-quiz';
import {SearchComponent} from '../../component/search/search-component/search-component';
import {Tabs} from '../../component/tabs/tabs/tabs';
import {ButtonEnum, ITabsMode} from '../../component/tabs/constants';
import {QuizFilter} from '../../component/quiz/quiz-filter/quiz-filter';
import {QuizService} from '../../service/quiz/quiz-service';

@Component({
  selector: 'app-quiz',
  imports: [
    CreateQuiz,
    AllQuiz,
    SearchComponent,
    Tabs,
    QuizFilter,
  ],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css'
})
export class Quiz {

  public ButtonEnum = ButtonEnum;

  constructor(
    private readonly quizService: QuizService
  ) {}

  public get tabsConfiguration(): ITabsMode {
    return {[ButtonEnum.ALL]: true, [ButtonEnum.CREATE]: true, [ButtonEnum.SEARCH]: true, }
  }

  public get activePage(): ButtonEnum | undefined {
    return this.quizService.pageActive;
  }

  public set activePage(value: ButtonEnum | undefined) {
    this.quizService.pageActive = value;
  }

  public activationPage(event: ButtonEnum) {
    this.activePage = event;
  }

  public onSearchActivated(buttonEnum: ButtonEnum) {
    this.activePage = buttonEnum;
  }
}
