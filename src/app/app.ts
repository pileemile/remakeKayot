import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './component/header/header';
import {Footer} from './component/footer/footer';
import {initFlowbite} from 'flowbite';
import {Drawer} from './component/drawer/drawer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Drawer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{

  ngOnInit() {
    initFlowbite() ;
  }

}
