import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonFilter} from "../button-filter/button-filter";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ButtonFilterEnum} from '../button-filter/constent';
import {SearchInterface} from '../../models/search/search';
import {ButtonEnum} from '../tabs/constants';
import {SearchService} from '../../service/search-service/search-service';
import {QuizzesService} from '../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-filter-form',
    imports: [
        ButtonFilter,
        ReactiveFormsModule
    ],
  templateUrl: './filter-form.html',
  styleUrl: './filter-form.css'
})
export class FilterForm {
  @Output() activateFilter = new EventEmitter<ButtonEnum>();

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
