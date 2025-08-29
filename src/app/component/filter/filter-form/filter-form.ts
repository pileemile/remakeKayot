import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonFilter} from "../../button-filter/button-filter";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ButtonFilterEnum} from '../../button-filter/constent';
import {SearchInterface} from '../../../models/search/search';
import {ButtonEnum} from '../../tabs/constants';
import {SearchService} from '../../../service/search-service/search-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {InputFilter} from '../input-filter/input-filter';
import {FilterTypeEnum, IFilterType} from '../constent';

@Component({
  selector: 'app-filter-form',
  imports: [
    ButtonFilter,
    ReactiveFormsModule,
    InputFilter
  ],
  templateUrl: './filter-form.html',
  styleUrl: './filter-form.css'
})
export class FilterForm {
  @Input()
  get filter(): IFilterType { return this._filter ?? {}; }
  set filter(new_filter: IFilterType) {
    this._filter = new_filter;
    if (new_filter) {
      this.filters = Object.entries(new_filter)
        .filter(([_, v]) => v)
        .map(([k]) => k as FilterTypeEnum);
    } else {
      this.filters = [];
    }
  }
  @Input() enumRef? :

  @Output() activateFilter = new EventEmitter<ButtonEnum>();

  private _filter?: IFilterType;

  public filters?: FilterTypeEnum[];
  public form: FormGroup;

  public constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private quizzesService: QuizzesService
  ) {
    this.form = this.formBuilder.group({
      category: [''],
      difficulty: [''],
      created_at: [''],
      finish_at: ['']
    })
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
