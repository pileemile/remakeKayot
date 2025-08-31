import {Component, Input} from '@angular/core';
import {ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule} from '@angular/forms';
import {labelInput, selectedFilter, SelectFilterEnum} from '../constent';

@Component({
  selector: 'app-select-filter',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './select-filter.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  styleUrl: './select-filter.css'
})
export class SelectFilter {
  @Input() state!: SelectFilterEnum;
  @Input() parentForm!: FormGroup;


  public get label() {
    return labelInput[this.state];
  }

  public get select()  {
    return selectedFilter[this.state];
  }

}
