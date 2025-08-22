import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonEnum, ITabsMode} from '../constants';
import {ButtonTabs} from '../component/button-tabs/button-tabs';

@Component({
  selector: 'app-tabs',
  imports: [
    ButtonTabs,
  ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css'
})
export class Tabs {
  @Input()
  get mode(): ITabsMode {return <ITabsMode>this._mode || {};}
  set mode(new_mode: ITabsMode) {
    this._mode = new_mode;
    if (new_mode) {
      this.modes = Object.entries(this.mode).filter((v) => v).map((v) => v[0]) as ButtonEnum[] ;
    }
  }
  @Output() activeTab: EventEmitter<ButtonEnum> = new EventEmitter();

  private _mode?: ITabsMode;

  public buttonActivate?: ButtonEnum;
  public modes?: ButtonEnum[];

  public setActivate(event?: ButtonEnum) {
    this.buttonActivate = event;
    this.activeTab.emit(this.buttonActivate);
  }

}
