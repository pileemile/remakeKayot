import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonEnum} from '../../tabs/constants';
import {FilterForm} from '../../filter/filter-form/filter-form';
import {FilterTypeEnum, IFilterType, SelectFilterEnum} from '../../filter/constent';

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

  public get filterConfiguration(): IFilterType {
    return {[FilterTypeEnum.CREATED_AT]: true, [FilterTypeEnum.FINISH_AT]: true, [SelectFilterEnum.CATEGORY]: true, [SelectFilterEnum.DIFFICULTY]: true};
  }

}
