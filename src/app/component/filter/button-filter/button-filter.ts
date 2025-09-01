import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonEnum} from '../../tabs/constants';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-button-filter',
  imports: [],
  templateUrl: './button-filter.html',
  styleUrl: './button-filter.css'
})
export class ButtonFilter {

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
