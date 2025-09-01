import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonEnum} from '../../tabs/constants';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {ButtonFilterType} from './constent';

@Component({
  selector: 'app-button-filter',
  imports: [],
  templateUrl: './button-filter.html',
  styleUrl: './button-filter.css'
})
export class ButtonFilter {
  @Input() buttonType: ButtonFilterType = ButtonFilterType.ALL;

  @Output() onButtonClick: EventEmitter<ButtonEnum> = new EventEmitter();

  constructor(
    public quizzesService: QuizzesService,
  ) {}

  public onDeleteClick(){
    this.onButtonClick.emit(ButtonEnum.CLEAR)
  }

  private set activePage(value: ButtonEnum | undefined) {
    this.quizzesService.pageActive = value;
  }

  public onFilterClick(event: MouseEvent) {
    event.preventDefault();
    this.activePage = ButtonEnum.FILTER;
    this.onButtonClick.emit(ButtonEnum.FILTER)

  }

}
