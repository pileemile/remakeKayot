import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonFilter} from "../button-filter/button-filter";
import {FilterType, SelectFilterEnum} from '../constent';
import {SearchQuizzesInterface, SearchUsersInterface} from '../../../models/search/search';
import {ButtonEnum} from '../../tabs/constants';
import {SearchService} from '../../../service/search-service/search-service';
import {InputFilter} from '../input-filter/input-filter';
import {FilterTypeEnum, IFilterType} from '../constent';
import {SelectFilter} from '../select-filter/select-filter';
import {FilterService} from '../../../service/filter/filter-service';

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
export class FilterForm implements OnInit{
  @Input()
  get filter(): IFilterType { return this._filter ?? {}; }
  set filter(new_filter: IFilterType) {
    this._filter = new_filter;
    if (new_filter) {
      const activeKeys = Object.entries(new_filter)
        .filter(([_, v]) => v)
        .map(([k]) => k);
      this.filters = activeKeys.filter((k) =>
        Object.values(FilterTypeEnum).includes(k as FilterTypeEnum)
      ) as FilterTypeEnum[];

      this.selects = activeKeys.filter((k) =>
        Object.values(SelectFilterEnum).includes(k as SelectFilterEnum)
      ) as SelectFilterEnum[];

    } else {
      this.filters = [];
      this.selects = [];
    }
  }
  @Input() filterType: FilterType = FilterType.ALL;

  @Output() activateFilter = new EventEmitter<ButtonEnum>();

  ngOnInit() {
  }

  private _filter?: IFilterType;

  public filters?: FilterTypeEnum[];
  public selects?: SelectFilterEnum[];

  public constructor(
    private searchService: SearchService,
    private filterService: FilterService,
  ) {
  }
  public async onSubmit() {
    if (this.filterGet) {
      const search = this.filterGet as SearchQuizzesInterface;
      const user = this.filterGet as SearchUsersInterface;
      if(this.filterType === FilterType.QUIZ) {
        await this.searchService.searchQuizzes(search);
        this.activateFilter.emit(ButtonEnum.FILTER);
      } else if (this.filterType === FilterType.USER  ) {
        await this.searchService.searchUser(user);
        this.activateFilter.emit(ButtonEnum.SEARCH_USER);
      } else
        console.log("errorr");
      console.log("search", this.filterGet)
    }

  }


  public onReset() {
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

  public get filterGet() {
    return this.filterService.filterQuizzes.value
  }
}
