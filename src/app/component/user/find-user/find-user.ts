import { Component } from '@angular/core';
import {FilterTypeEnum} from '../../filter/constent';
import {FilterForm} from '../../filter/filter-form/filter-form';

@Component({
  selector: 'app-find-user',
  imports: [
    FilterForm
  ],
  templateUrl: './find-user.html',
  styleUrl: './find-user.css'
})
export class FindUser {

  public get filterConfiguration() {
    return {
      [FilterTypeEnum.FIRST_NAME]: true,
      [FilterTypeEnum.LAST_NAME]: true,
      [FilterTypeEnum.ADRESS]: true,
      [FilterTypeEnum.CP]: true,
      [FilterTypeEnum.CITY]: true,
    }
  }

}
