import {Component, Inject} from '@angular/core';
import {NgClass} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogClose} from '@angular/material/dialog';
import {data} from 'autoprefixer';

@Component({
  selector: 'app-create-quiz-dialog',
  imports: [
    NgClass,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './create-quiz-dialog.html',
  styleUrl: './create-quiz-dialog.css'
})
export class CreateQuizDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, type: 'success' | 'error' }) {}

}
