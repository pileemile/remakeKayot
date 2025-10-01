import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from '../../../service/login/login-service';
import {MatDialog} from '@angular/material/dialog';
import {DialogForgotPassword} from '../dialog-forgot-password/dialog-forgot-password';
import {ActivatedRoute, Router} from '@angular/router';

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
    private readonly navigateRoute: Router,
    public loginService: LoginService,
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.routeUrl = this.route.snapshot.url.join('');

  }

  public async onSubmit() {
    if(!this.form.valid){
      this.handleInvalidForm();
      return;
    }
    const formValue = this.form.value;
    await this.routeAction(formValue);
  }

  public openForgetPassword(){
    this.dialog.open(DialogForgotPassword, {
      width: '400px',
      height: '200px',
      maxHeight: '100%',
      maxWidth: '100%',
    });
  }

  private handleInvalidForm(): void {
    console.error('Form is invalid');
  }

  private async routeAction(formValue: any) {
    switch (this.routeUrl) {
      case 'reset-password':
        await this.handleResetPassword(formValue);
        break;
      case 'register':
        await this.handleRegister(formValue);
        break;
      default:
        await this.handleLogin(formValue);
    }
  }

  private async handleResetPassword(data: any) {
    this.loginService.updateUser$.next(data);
    try {
      await this.loginService.updateUser(data)
    } catch (error) {
      console.error("erreur sur le reset de mot de passe", error);
    }
  }

  private async handleRegister(data: any) {
    this.loginService.login$.next(data);
    try {
      await this.loginService.loginSigUp(data);
      await this.navigateRoute.navigate(['/login']);
    } catch (error) {
      console.error("erreur sur le register", error);
    }
  }

  private async handleLogin(data: any) {
    this.loginService.login$.next(data);
    try {
      await this.loginService.loginSigInRest(data);
      await this.navigateRoute.navigate(['/all-quiz']);
    } catch (error) {
      console.error("erreur sur le login", error);
    }
  }
}
