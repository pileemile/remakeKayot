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

  @Output() ButtonClick: EventEmitter<ButtonEnum> = new EventEmitter();

  constructor(
    private readonly quizService: QuizService,
  ) {}

  public onDeleteClick(){
    this.ButtonClick.emit(ButtonEnum.CLEAR)
  }

  private set activePage(value: ButtonEnum | undefined) {
    this.quizService.pageActive = value;
  }

  public onFilterClick(event: MouseEvent) {
    event.preventDefault();
    this.activePage = ButtonEnum.FILTER;
    this.ButtonClick.emit(ButtonEnum.FILTER)

  }

}
