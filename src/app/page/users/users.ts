import { Component } from '@angular/core';
import {Tabs} from "../../component/tabs/tabs/tabs";
import {ButtonEnum, ITabsMode} from '../../component/tabs/constants';
import {AllUsers} from '../../component/user/all-users/all-users';
import {FindUser} from '../../component/user/find-user/find-user';

@Component({
  selector: 'app-users',
  imports: [
    Tabs,
    AllUsers,
    FindUser
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
  public pageActive?: ButtonEnum;


  public get tabsConfiguration(): ITabsMode {
    return {[ButtonEnum.FIND_USER]: true, [ButtonEnum.ALL_USERS]: true};
  }

  public activationPage(event: ButtonEnum) {
    this.pageActive = event;
  }

  protected readonly ButtonEnum = ButtonEnum;
}
