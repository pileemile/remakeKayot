import {Component, EventEmitter, Output, Input} from '@angular/core';
import {TableAction, TableColumn} from '../../models/tables/tables-interface';
import {Quizzes} from '../../models/quizzes/quizzes';
import {UserModele} from '../../models/user/user-modele';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  @Input() data: Quizzes[] | UserModele[] | null = null;
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];

  @Output() actionClick = new EventEmitter<{action: string, item: any}>();

  public onActionClick(action: TableAction, item: any) {
    action.handler(item);
  }

}
