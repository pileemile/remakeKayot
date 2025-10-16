import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user';
import {NgClass} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProgressBar} from '../../progress-bar/progress-bar';
import {LevelService} from '../../../service/level/level-service';

@Component({
  selector: 'app-user-details',
  imports: [
    NgClass,
    ReactiveFormsModule,
    ProgressBar,
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit{

  private readonly id_user:string = '22ce5a89-1db2-46e7-a265-c929697ff1d0';

  public form: FormGroup;
  public isEditing: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    public readonly levelService: LevelService,
  ) {
    this.form = this.formBuilder.group(
      {
        first_name: [{value: '', disabled: true}, Validators.required],
        last_name: [{value: '', disabled: true}, Validators.required],
        adress: [{value: '', disabled: true}, Validators.required],
        ville: [{value: '', disabled: true}, Validators.required],
        cp: [{value: '', disabled: true}, Validators.required],
      }
    )
  }

  async ngOnInit() {
    this.updateFormValues();
    this.loadData().then();
  }

  private async loadData() {
    await this.userService.getUserById(this.id_user);
    await this.userService.getQuizByUserId(this.id_user);
    await this.levelService.getUserLevel(this.id_user);
  }

  private updateFormValues() {
    if (this.user) {
      this.form.patchValue({
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        adress: this.user.adress,
        ville: this.user.ville,
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
      this.form.get('ville')?.enable();
      this.form.get('cp')?.enable();
    } else {
      this.form.get('first_name')?.disable();
      this.form.get('last_name')?.disable();
      this.form.get('adress')?.disable();
      this.form.get('ville')?.disable();
      this.form.get('cp')?.disable();
    }
  }

   public async onSubmit() {
    this.userService.editUser.next(this.form.value);
    await this.userService.updateUser(this.form.value, this.id_user);
    await this.userService.getUserById(this.id_user);
    this.isEditing = !this.isEditing;
  }

}
