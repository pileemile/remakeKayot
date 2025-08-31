import {Component, EventEmitter, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ButtonEnum} from '../../tabs/constants';
import {FilterForm} from '../../filter/filter-form/filter-form';
import {ButtonFilterEnum, FilterTypeEnum, IFilterType, SelectFilterEnum} from '../../filter/constent';

@Component({
  selector: 'app-search-component',
  imports: [
    ReactiveFormsModule,
    FilterForm
  ],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css'
})
export class SearchComponent {
  @Output() activateFilter = new EventEmitter<ButtonEnum>();
  public constructor(
  ) {
  }

  public get filterConfiguration(): IFilterType {
    return {[FilterTypeEnum.CREATED_AT]: true, [FilterTypeEnum.FINISH_AT]: true, [SelectFilterEnum.CATEGORY]: true, [SelectFilterEnum.DIFFICULTY]: true};
  }

  public async onSubmit() {
    // if (this.form.value) {
    //   const search = this.form.value as SearchInterface;
    //    await this.searchService.search(search);
    //   this.activateFilter.emit(ButtonEnum.FILTER);
    // }
    console.log("submit")
  }

  public onReset() {
    // this.form.reset();
    console.log("reset")
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
