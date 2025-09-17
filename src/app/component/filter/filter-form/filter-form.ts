import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonFilter } from "../button-filter/button-filter";
import { FilterEnum, IFilters, filterConfig } from '../constent';
import { ButtonEnum } from '../../tabs/constants';
import { SearchService } from '../../../service/search-service/search-service';
import { InputFilter } from '../input-filter/input-filter';
import { SelectFilter } from '../select-filter/select-filter';
import { FilterService } from '../../../service/filter/filter-service';

@Component({
  selector: 'app-filter-form',
  imports: [
    ButtonFilter,
    InputFilter,
    SelectFilter
  ],
  templateUrl: './filter-form.html',
  styleUrl: './filter-form.css'
})
export class FilterForm {
  @Input()
  get filter(): IFilters { return this._filter || {}; }
  set filter(newFilter: IFilters) {
    this._filter = newFilter;
    if (newFilter) {
      this.activeFilters = Object.keys(newFilter) as FilterEnum[];
    }
  }

  @Output() activateFilter = new EventEmitter<ButtonEnum>();

  private _filter?: IFilters;

  public activeFilters: FilterEnum[] = [];
  public filterConfig = filterConfig;

  constructor(
    private readonly searchService: SearchService,
    private readonly filterService: FilterService,
  ) {}

  public onReset() {
    this._filter = {};
    this.activeFilters = [];
  }

  public async onButtonClick(buttonType: ButtonEnum) {
    switch (buttonType) {
      case ButtonEnum.CLEAR:
        this.onReset();
        break;
      case ButtonEnum.FILTER:
        // await this.onSubmit();
        break;
    }
  }

  public get filterGet() {
    return this.filterService.filterQuizzes.value;
  }
}
