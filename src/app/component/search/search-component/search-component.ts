import {Component, EventEmitter, Output} from '@angular/core';
import {Category, Difficulty} from '../../../models/quizzes/quizzes';
import {SearchService} from '../../../service/search-service/search-service';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {SearchInterface} from '../../../models/search/search';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {ButtonEnum} from '../../tabs/constants';

@Component({
  selector: 'app-search-component',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css'
})
export class SearchComponent {
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

  public get categories() {
    return Object.values(Category);
  }

  public get difficulties() {
    return Object.values(Difficulty);
  }

  public async onSubmit() {
    if (this.form.value) {
      const search = this.form.value as SearchInterface;
       await this.searchService.search(search);
      this.activateFilter.emit(ButtonEnum.FILTER);
    }
  }
}
