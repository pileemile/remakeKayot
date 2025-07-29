import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pin-home',
  imports: [
    FormsModule
  ],
  templateUrl: './pin-home.html',
  styleUrl: './pin-home.css'
})
export class PinHome {

  constructor(
    private readonly router: Router,
  ) {}

 public navigate() {
    this.router.navigate(['/login']);
  }
}
