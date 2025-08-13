import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {Quizz} from '../../page/quizz/quizz';
import {initFlowbite} from 'flowbite';

@Component({
  selector: 'app-header',
  imports: [

  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  constructor(
    private readonly router: Router,
  ) {}

  private readonly dialog = inject(MatDialog)

  ngOnInit() {
    initFlowbite();
  }
  public openQuizzes() {
  this.dialog.open(Quizz, {
    width: '1000px',
    height: '800px',
    maxHeight: '100%',
    maxWidth: '100%',
  });
}
}
