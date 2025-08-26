import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user';
import {NgClass} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-user-details',
  imports: [
    NgClass,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit{

  private id_user:string = '22ce5a89-1db2-46e7-a265-c929697ff1d0';
  private readonly dialog = inject(MatDialog);

  public form: FormGroup;
  public isEditing: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    // Initialiser le formulaire avec des valeurs vides pour commencer
    this.form = this.formBuilder.group(
      {
        first_name: [{value: '', disabled: true}, Validators.required],
        last_name: [{value: '', disabled: true}, Validators.required],
        adress: [{value: '', disabled: true}, Validators.required],
        city: [{value: '', disabled: true}, Validators.required],
        cp: [{value: '', disabled: true}, Validators.required],
      }
    )
  }

  async ngOnInit() {
    await this.userService.getUserById(this.id_user);
    this.updateFormValues();
  }

  private updateFormValues() {
    if (this.user) {
      this.form.patchValue({
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        adress: this.user.adress,
        city: this.user.ville,
        cp: this.user.cp
      });
    }
  }

  public get user() {
    return this.userService.getUser
  }

  public toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.form.get('first_name')?.enable();
      this.form.get('last_name')?.enable();
      this.form.get('adress')?.enable();
      this.form.get('city')?.enable();
      this.form.get('cp')?.enable();
    } else {
      this.form.get('first_name')?.disable();
      this.form.get('last_name')?.disable();
      this.form.get('adress')?.disable();
      this.form.get('city')?.disable();
      this.form.get('cp')?.disable();
    }
  }


   public async onSubmit() {
    this.userService.editUser.next(this.form.value);
    await this.userService.updateUser(this.form.value, this.id_user);
    console.log("form valid", this.form.value);

  }

}
