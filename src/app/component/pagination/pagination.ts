import {Component, Input, OnInit} from '@angular/core';
import {PaginationService} from '../../service/pagination/pagination-service';
import {PaginationType} from './constent';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination implements OnInit{
  @Input() Type: PaginationType = PaginationType.ALL;

  constructor(
    private paginationService: PaginationService
  ) {}

  async ngOnInit() {
    if (this.Type === PaginationType.ALLUSERS){
      await this.paginationService.paginationUser(this.paginationService.pagination$.value?.page, this.paginationService.pagination$.value?.limit);
    }
    else if (this.Type === PaginationType.ALLQUIZZES){
      await this.paginationService.paginationQuizzes(this.paginationService.pagination$.value?.page, this.paginationService.pagination$.value?.limit);

    }
  }

   public async previousPage() {
    if (this.paginationService.pagination$.value?.page != 0 && this.paginationService.pagination$.value?.limit != 10) {
      const page = this.paginationService.pagination$.value?.page - 10;
      const limit = this.paginationService.pagination$.value?.limit - 10;
      this.paginationService.pagination$.next({page, limit});
      return await this.paginationService.paginationQuizzes(page, limit)
    }
    else
      return 0
  }

  public async nextPage() {
      const page = this.paginationService.pagination$.value?.page + 10;
      const limit = this.paginationService.pagination$.value?.limit + 10;
      this.paginationService.pagination$.next({page, limit});
      return await this.paginationService.paginationQuizzes(page, limit)
  }
}
