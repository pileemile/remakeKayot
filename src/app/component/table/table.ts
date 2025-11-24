import {Component, EventEmitter, Output, Input} from '@angular/core';
import {TableAction, TableColumn} from '../../models/tables/tables-interface';
import {Quiz} from '../../models/quiz/quiz';
import {UserModele} from '../../models/user/user-modele';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [
    NgClass
  ],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  @Input() data: (Quiz & { questionCount?: number; isCompleted?: boolean })[] | UserModele[] | number[] | null = null;
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];

  @Output() actionClick = new EventEmitter<{action: string, item: any}>();

  constructor(
  ) {}

  public onActionClick(action: TableAction, item: any) {
    action.handler(item);
  }

  public isItemCompleted(item: any): boolean {
    return item && typeof item === 'object' && 'isCompleted' in item ? item.isCompleted : false;
  }

  public getColumnValue(item: any, column: TableColumn): any {
    const value = item[column.key];
    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString('fr-FR') : '';
      case 'number':
        return value || 0;
      default:
        return value || '';
    }
  }

}
