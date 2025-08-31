import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonFilter} from "../button-filter/button-filter";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ButtonFilterEnum, SelectFilterEnum} from '../constent';
import {SearchInterface} from '../../../models/search/search';
import {ButtonEnum} from '../../tabs/constants';
import {SearchService} from '../../../service/search-service/search-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {InputFilter} from '../input-filter/input-filter';
import {FilterTypeEnum, IFilterType} from '../constent';
import {SelectFilter} from '../select-filter/select-filter';

@Component({
  selector: 'app-filter-form',
  imports: [
    ButtonFilter,
    ReactiveFormsModule,
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

      const group: { [key: string]: any } = {};
      [...this.filters, ...this.selects].forEach(key => {
        group[key] = [''];
      });
      this.form = this.formBuilder.group(group);

    } else {
      this.filters = [];
      this.selects = [];
      this.form = this.formBuilder.group({});
    }
  }

  @Output() activateFilter = new EventEmitter<ButtonEnum>();

  ngOnInit() {
    console.log("form", this.form.value)
  }

  private _filter?: IFilterType;

  public filters?: FilterTypeEnum[];
  public selects?: SelectFilterEnum[];
  public form: FormGroup;

  public constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private quizzesService: QuizzesService
  ) {
    this.form = this.formBuilder.group({})
  }
  public async onSubmit() {
    if (this.form.value) {
      const search = this.form.value as SearchInterface;
      await this.searchService.search(search);
      this.activateFilter.emit(ButtonEnum.FILTER);
    }
  }

  public onReset() {
    this.form.reset();
  }
  public onButtonClick(buttonType: ButtonFilterEnum) {
    switch (buttonType) {
      case ButtonFilterEnum.CLEAR:
        this.onReset();
        break;
      case ButtonFilterEnum.SEARCH:
        this.onSubmit();
        break;
    }
  }
}
