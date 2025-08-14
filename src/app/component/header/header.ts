import {Component, inject, OnInit} from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import {Quizz} from '../../page/quizz/quizz';
import {UserParameter} from '../user/user-parameter/user-parameter';

@Component({
  selector: 'app-header',
  imports: [
    UserParameter

  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  constructor(
  ) {}

  private readonly dialog = inject(MatDialog);

  public openQuizzes() {
  this.dialog.open(Quizz, {
    width: '1000px',
    height: '800px',
    maxHeight: '100%',
    maxWidth: '100%',
  });
}
}
