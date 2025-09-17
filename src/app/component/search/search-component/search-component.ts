import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonEnum} from '../../tabs/constants';
import {FilterForm} from '../../filter/filter-form/filter-form';
import {FilterEnum, IFilters} from '../../filter/constent';

@Component({
  selector: 'app-search-component',
  imports: [
    FilterForm
  ],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css'
})
export class SearchComponent {
  @Output() activateFilter = new EventEmitter<ButtonEnum>();

  public get filterConfiguration(): IFilters {
    return {[FilterEnum.CREATED_AT]: true, [FilterEnum.FINISH_AT]: true, [FilterEnum.CATEGORY]: true, [FilterEnum.DIFFICULTY]: true};
  }
}
