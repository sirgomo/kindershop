import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from '../user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractControl, AbstractControlOptions, AbstractFormGroupDirective, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordErrorStateMatcher } from './passwordErrorStateMatcher';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent {

  passForm: FormGroup;
  passMatcher = new PasswordErrorStateMatcher();
  save$ = new Observable<any>();
  userid = localStorage.getItem('userid');
  constructor(private userService: UserService, private dialRef: MatDialogRef<ChangePasswordComponent>, private snackBar: MatSnackBar, private fb: FormBuilder) {
    this.passForm = fb.group({
      newPassword: ['', [ Validators.required ,Validators.minLength(5)]],
      altePassword: ['', [Validators.required, Validators.minLength(5)]],
      passWiderholung: ['']
    }, { validators: this.checkPass });
  }

  abbrechen() {

    this.dialRef.close();
  }
  passwordSpeichern() {
    if(!this.userid)
    {
      this.snackBar.open('Etwas ist schiefgegangen, kein userid gefunden!', 'Ok', {duration: 3000});
      return;
    }

    this.save$ =  this.userService.changePassword({ id: Number(this.userid), password: this.passForm.get('newPassword')?.getRawValue(), altpass:  this.passForm.get('altePassword')?.getRawValue()}, this.dialRef);
  }
  checkPass(group: AbstractControl) {
   return group.get('newPassword')?.getRawValue() === group.get('passWiderholung')?.getRawValue() ? null : { notSame: true };

  }
}
