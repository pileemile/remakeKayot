import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from '../../../service/login/login-service';
import {MatDialog} from '@angular/material/dialog';
import {DialogForgotPassword} from '../dialog-forgot-password/dialog-forgot-password';
import {ActivatedRoute} from '@angular/router';
import {Login} from '../../../models/login/login';

@Component({
  selector: 'app-component-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './component-login.html',
  styleUrl: './component-login.css'
})
export class ComponentLogin implements OnInit{

  public form: FormGroup;
  private readonly dialog = inject(MatDialog)
  private routeUrl: string | undefined;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    public loginService: LoginService,
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.routeUrl = this.route.snapshot.url.join('');
    console.log(this.routeUrl)

  }

  public async onSubmit() {
      if (this.form.valid) {
        if (this.routeUrl === 'login') {
          const login = this.form.value;
          this.loginService.login$.next(login);
          if (this.loginService.login$.value) {
            await this.loginService.loginSigIn(login);

          }
        } else if(this.routeUrl === 'register') {
          const register = this.form.value;
          this.loginService.login$.next(register);
          if (this.loginService.login$.value) {
            await this.loginService.loginSigUp(register);
          }
        }
        /* TODO l'update se fait habituellement sur une nouvelle page*/
        else {
          const update = this.form.value;
          this.loginService.updateUser$.next(update);
          if (this.loginService.updateUser$.value){
           await this.loginService.updateUser(this.loginService.updateUser$.value)
            console.log('update', this.loginService.updateUser$.value)
          } else
            console.log("erreur requête", this.loginService.updateUser$.value)
        }
      } else {
        console.log('form invalid');
      }
  }

  public openForgetPassword(){
    this.dialog.open(DialogForgotPassword, {
      width: '400px',
      height: '200px',
      maxHeight: '100%',
      maxWidth: '100%',
    });
  }

}
