import {Component, EventEmitter, Input, Output, output} from '@angular/core';
import {ButtonEnum, labels} from '../../constants';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-button-tabs',
  imports: [
    NgClass
  ],
  templateUrl: './button-tabs.html',
  styleUrl: './button-tabs.css'
})
export class ButtonTabs {
  @Input() state: ButtonEnum = ButtonEnum.ALL;
  @Input() buttonActivate?: ButtonEnum;
  @Output() onClick: EventEmitter<ButtonEnum | undefined> = new EventEmitter();

  public get isActive(): boolean {
    return this.state === this.buttonActivate;
  }

  public get label() {
    return labels[this.state];
  }

  public click($event: MouseEvent) {
    this.onClick.emit(!this.isActive ? this.state : undefined);
  }
}
