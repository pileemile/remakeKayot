import {Component, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormGroupDirective, ControlContainer, FormGroup} from "@angular/forms";
import {FilterTypeEnum, labelInput} from '../constent';

@Component({
  selector: 'app-input-filter',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],

  templateUrl: './input-filter.html',
  styleUrl: './input-filter.css'
})
export class InputFilter implements OnInit{
  @Input() state!: FilterTypeEnum;
  @Input() parentForm!: FormGroup;

  ngOnInit() {
    console.log('state',this.state)
  }
  public get label() {
    return labelInput[this.state];
  }

  public test(){
    console.log('test')
  }
}
