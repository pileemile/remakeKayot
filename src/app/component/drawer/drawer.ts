import {Component, OnInit} from '@angular/core';
import {initFlowbite} from 'flowbite';
import {Router} from '@angular/router';

@Component({
  selector: 'app-drawer',
  imports: [],
  templateUrl: './drawer.html',
  styleUrl: './drawer.css'
})
export class Drawer implements OnInit{

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    initFlowbite();
  }

  open_dashboard() {
    this.router.navigate(['/dashboard']);
  }
}
