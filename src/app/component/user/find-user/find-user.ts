import {Component, EventEmitter, Output} from '@angular/core';
import {FilterEnum, FilterType} from '../../filter/constent';
import {FilterForm} from '../../filter/filter-form/filter-form';
import {ButtonEnum} from '../../tabs/constants';

@Component({
  selector: 'app-find-user',
  imports: [
    FilterForm
  ],
  templateUrl: './find-user.html',
  styleUrl: './find-user.css'
})
export class FindUser {
  @Output() activateFilter = new EventEmitter<ButtonEnum>()

  public get filterConfiguration() {
    return {
      [FilterEnum.FIRST_NAME]: true,
      [FilterEnum.LAST_NAME]: true,
      [FilterEnum.ADRESS]: true,
      [FilterEnum.CP]: true,
      [FilterEnum.CITY]: true,
    }
  }

  protected readonly FilterType = FilterType;
}
