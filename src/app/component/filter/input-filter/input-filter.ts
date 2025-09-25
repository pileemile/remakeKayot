import {Component, Input} from '@angular/core';
import {FilterService} from '../../../service/filter/filter-service';
import {ControlContainer, FormGroup, FormGroupDirective, FormsModule} from '@angular/forms';
import {filterConfig, FilterEnum} from '../constent';

@Component({
  selector: 'app-input-filter',
  imports: [
    FormsModule
  ],
  templateUrl: './input-filter.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  styleUrl: './input-filter.css'
})
export class InputFilter {
  @Input() state!: FilterEnum;
  @Input() parentForm!: FormGroup;

  public value: string = '';

  constructor(
    private readonly filterService: FilterService
  ){}

  public get label() {
    return filterConfig[this.state].label ?? '';
  }

  public get type() {
    return filterConfig[this.state].type ?? '';
  }


  onValueChange(newValue: string) {
    this.filterService.updateFilter(this.state, newValue);
  }

}
