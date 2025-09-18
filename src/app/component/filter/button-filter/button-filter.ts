import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonEnum} from '../../tabs/constants';
import {QuizService} from '../../../service/quiz/quiz-service';
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
    public quizzesService: QuizService,
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
