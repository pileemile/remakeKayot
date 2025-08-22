import { Component } from '@angular/core';
import {Tabs} from "../../component/tabs/tabs/tabs";
import {ButtonEnum, ITabsMode} from '../../component/tabs/constants';

@Component({
  selector: 'app-users',
    imports: [
        Tabs
    ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
  public pageActive?: ButtonEnum;


  public get tabsConfiguration(): ITabsMode {
    return {[ButtonEnum.ALL]: true, [ButtonEnum.CREATE]: true, [ButtonEnum.SEARCH]: true, [ButtonEnum.FILTER]: true}
  }

  public activationPage(event: ButtonEnum) {
    this.pageActive = event;
  }
}
