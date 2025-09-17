import { Component } from '@angular/core';
import {FilterEnum} from '../../filter/constent';
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
      [FilterEnum.FIRST_NAME]: true,
      [FilterEnum.LAST_NAME]: true,
      [FilterEnum.ADRESS]: true,
      [FilterEnum.CP]: true,
      [FilterEnum.CITY]: true,
    }
  }

}
