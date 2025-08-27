import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonFilterEnum} from './constent';

@Component({
  selector: 'app-button-filter',
  imports: [],
  templateUrl: './button-filter.html',
  styleUrl: './button-filter.css'
})
export class ButtonFilter {

  @Output() onButtonClick: EventEmitter<ButtonFilterEnum> = new EventEmitter();

  public onDeleteClick(){
    this.onButtonClick.emit(ButtonFilterEnum.CLEAR)
  }

  public onFilterClick() {
    this.onButtonClick.emit(ButtonFilterEnum.SEARCH)
  }

}
