import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-dialog-success-error',
  imports: [
    MatDialogClose,
    NgClass
  ],
  templateUrl: './dialog-success-error.html',
  styleUrl: './dialog-success-error.css'
})
export class DialogSuccessError {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, type: 'success' | 'error' }) {}

}
