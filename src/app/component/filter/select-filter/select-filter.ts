import {Component, Input} from '@angular/core';
import {ControlContainer, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {labelInput, selectedFilter, SelectFilterEnum} from '../constent';
import {FilterService} from '../../../service/filter/filter-service';

@Component({
  selector: 'app-select-filter',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './select-filter.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  styleUrl: './select-filter.css'
})
export class SelectFilter {
  @Input() state!: SelectFilterEnum;
  @Input() parentForm!: FormGroup;

  public value: string = '';

  constructor(
    private filterService: FilterService
  ){}

  public get label() {
    return labelInput[this.state];
  }

  public get select()  {
    return selectedFilter[this.state];
  }


  onValueChange(newValue: string) {
    this.filterService.updateFilter(this.state, newValue);
    console.log("newValue", this.filterService.filterQuizzes.value)
  }
}
