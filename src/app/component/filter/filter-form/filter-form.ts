import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonFilter } from "../button-filter/button-filter";
import {FilterEnum, IFilters, filterConfig, FilterType} from '../constent';
import { ButtonEnum } from '../../tabs/constants';
import { InputFilter } from '../input-filter/input-filter';
import { SelectFilter } from '../select-filter/select-filter';
import {FilterService} from '../../../service/filter/filter-service';
import {SearchService} from '../../../service/search-service/search-service';
import {PaginationService} from '../../../service/pagination/pagination-service';

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

  @Input() filterType!:FilterType ;

  @Output() activateFilter = new EventEmitter<ButtonEnum>();

  constructor(
    private readonly filterService: FilterService,
    private readonly searchService: SearchService,
    private readonly paginationService: PaginationService
  ) {
  }

  private _filter?: IFilters;

  public activeFilters: FilterEnum[] = [];
  public filterConfig = filterConfig;

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
         await this.onSubmit();
        break;
    }
  }

  private get filterQuiz() {
    return this.filterService.filterQuiz.value;
  }

  public async onSubmit() {
    if(FilterType.QUIZ === this.filterType) {
      await this.searchService.searchQuiz(this.filterQuiz);
      await this.paginationService.paginationQuizFilter(0, 10);
    }
    if(FilterType.USER === this.filterType) {
      await this.searchService.searchUser(this.filterQuiz);
    }
  }
}
