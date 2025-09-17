import { Component } from '@angular/core';
import {Tabs} from "../../component/tabs/tabs/tabs";
import {ButtonEnum, ITabsMode} from '../../component/tabs/constants';
import {AllUsers} from '../../component/user/all-users/all-users';
import {FindUser} from '../../component/user/find-user/find-user';
import {QuizzesService} from '../../service/quizzes/quizzes-service';
import {UserFilter} from '../../component/user/user-filter/user-filter';

@Component({
  selector: 'app-users',
  imports: [
    Tabs,
    AllUsers,
    FindUser,
    UserFilter
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
  public ButtonEnum = ButtonEnum;

  constructor(
    private readonly quizService: QuizzesService
  ) {}

  public get activePage(): ButtonEnum | undefined {
    return this.quizService.pageActive;
  }

  public set activePage(value: ButtonEnum | undefined) {
    this.quizService.pageActive = value;
  }

  public get tabsConfiguration(): ITabsMode {
    return {[ButtonEnum.FIND_USER]: true, [ButtonEnum.ALL_USERS]: true};
  }

  public activationPage(event: ButtonEnum) {
    this.activePage = event;
  }

  public onSearchActivated(buttonEnum: ButtonEnum) {
    this.activePage = buttonEnum;
  }
}
