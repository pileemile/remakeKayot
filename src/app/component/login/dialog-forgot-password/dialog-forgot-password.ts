import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from '../../../service/login/login-service';
import {MatDialogActions, MatDialogClose} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-forgot-password',
  imports: [
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './dialog-forgot-password.html',
  styleUrl: './dialog-forgot-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogForgotPassword implements OnInit{

  public form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    public loginService: LoginService,
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.email],
    });
  }

  ngOnInit() {
    this.loginService.forgotPassword$.subscribe(login => {
      if(login) {
        this.form.patchValue({
          email: login.email,
        })
      }
    })
  }
  public onSubmit() {
    console.log('click')
    if (this.form.valid) {
      const login = this.form.value;
      this.loginService.forgotPassword$.next(login);
      if (this.loginService.forgotPassword$.value){
        this.loginService.forgotPassword(this.loginService.forgotPassword$.value)
        console.log('mot de passe', this.loginService.forgotPassword$.value)

      }
    } else {
      console.log('form invalid');
    }
  }

}
