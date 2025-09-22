import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterService } from '../../../service/filter/filter-service';
import { FilterEnum, filterConfig } from '../constent';

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
  @Input() state!: FilterEnum;
  @Input() parentForm!: FormGroup;

  public value = '';

  constructor(
    private readonly filterService: FilterService
  ) {}

  get label(): string {
    return filterConfig[this.state]?.label ?? '';
  }

  get values(): string[] {
    const config = filterConfig[this.state];

    if (config && 'values' in config) {
      return config.values ?? [];
    }

    if (config?.type === 'select') {
      return [];
    }

    return [];
  }



  onValueChange(newValue: string) {
    this.filterService.updateFilter(this.state, newValue);
    console.log("newValue", this.filterService.filterQuiz.value);
  }
}
