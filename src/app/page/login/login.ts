import {Component, OnInit} from '@angular/core';
import {ComponentLogin} from '../../component/login/component-login/component-login';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ComponentLogin,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login  implements OnInit{
  public routeUrl: string | undefined;

  constructor(
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.routeUrl = this.route.snapshot.url.join('');
    console.log(this.routeUrl)

  }

}
