import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginationType } from './constent';
import { PaginationService } from '../../service/pagination/pagination-service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.css']
})
export class Pagination implements OnInit, OnDestroy {
  @Input() type!: PaginationType;

  private readonly destroy$ = new Subject<void>();

  public currentPage = 1;
  public totalPages = 1;
  public totalItems = 0;
  public itemsPerPage = 10;
  public isLoading = false;

  constructor(
    private readonly paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.subscribeToPageChanges();
    this.initializePagination();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToPageChanges(): void {
    this.paginationService.pagination$
      .pipe(takeUntil(this.destroy$))
      .subscribe(pagination => {
        if (pagination) {
          this.currentPage = Math.floor(pagination.page / this.itemsPerPage) + 1;
          this.totalPages = Math.ceil(pagination.total / this.itemsPerPage);
          this.totalItems = pagination.total;
        }
      });
  }

  private async initializePagination(): Promise<void> {
    const currentPagination = this.paginationService.pagination$.value;
    const page = currentPagination?.page || 0;
    const limit = currentPagination?.limit || this.itemsPerPage;

    await this.loadData(page, limit);
  }

  async previousPage(): Promise<void> {
    if (this.currentPage <= 1 || this.isLoading) return;

    const newPage = (this.currentPage - 2) * this.itemsPerPage;
    await this.loadData(newPage, this.itemsPerPage);
  }

  async nextPage(): Promise<void> {
    if (this.currentPage >= this.totalPages || this.isLoading) return;

    const newPage = this.currentPage * this.itemsPerPage;
    await this.loadData(newPage, this.itemsPerPage);
  }

  async goToPage(pageNumber: number): Promise<void> {
    if (pageNumber < 1 || pageNumber > this.totalPages || pageNumber === this.currentPage || this.isLoading) {
      return;
    }

    const newPage = (pageNumber - 1) * this.itemsPerPage;
    await this.loadData(newPage, this.itemsPerPage);
  }

  private async loadData(page: number, limit: number): Promise<void> {
    try {
      this.isLoading = true;

      switch (this.type) {
        case PaginationType.ALLUSERS:
          await this.paginationService.paginationUser(page, limit);
          break;
        case PaginationType.ALLQUIZ:
          await this.paginationService.paginationQuiz(page, limit);
          break;
        case PaginationType.QUIZFILTER:
          await this.paginationService.paginationQuizFilter(page, limit);
          break;
        default:
          console.warn('pagination non supporté:', this.type);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1 && !this.isLoading;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages && !this.isLoading;
  }

  get visiblePages(): number[] {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (let i = Math.max(2, this.currentPage - delta);
         i <= Math.min(this.totalPages - 1, this.currentPage + delta);
         i++) {
      range.push(i);
    }

    if (this.currentPage - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (this.currentPage + delta < this.totalPages - 1) {
      rangeWithDots.push(-1, this.totalPages);
    } else {
      rangeWithDots.push(this.totalPages);
    }

    return rangeWithDots;
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
}
