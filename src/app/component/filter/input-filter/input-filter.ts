import {Component, Input} from '@angular/core';
import {FilterTypeEnum, labelInput, typeInput} from '../constent';
import {FilterService} from '../../../service/filter/filter-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-input-filter',
  imports: [
    FormsModule
  ],
  templateUrl: './input-filter.html',
  styleUrl: './input-filter.css'
})
export class InputFilter {
  @Input() state!: FilterTypeEnum;

  public value: string = '';

  constructor(
    private filterService: FilterService
  ){}

  public get label() {
    return labelInput[this.state];
  }

  public get input() {
    return typeInput[this.state];
  }

  onValueChange(newValue: string) {
    this.filterService.updateFilter(this.state, newValue);
    console.log("newValue", this.filterService.filterQuizzes.value)
  }

}
