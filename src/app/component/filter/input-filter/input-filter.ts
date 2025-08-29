import {Component, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormGroup, FormGroupDirective, ControlContainer} from "@angular/forms";
import {FilterTypeEnum, labelInput} from '../constent';

@Component({
  selector: 'app-input-filter',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './input-filter.html',
  styleUrl: './input-filter.css'
})
export class InputFilter {
  @Input() state: FilterTypeEnum = FilterTypeEnum.ALL;
  @Input() form!: FormGroup;

  public get label() {
    return labelInput[this.state];
  }
}
