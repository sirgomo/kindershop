import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent  {
  registrationForm: FormGroup;
  regi$ = new Observable<any>;
  constructor(
    private dialogRef: MatDialogRef<RegisterComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService  ) {
    this.registrationForm = this.formBuilder.group({
      id: [null],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      strasse: ['', Validators.required],
      hausnummer: ['', Validators.required],
      plz: ['', Validators.required],
      stadt: ['', Validators.required],
      l_nachname: [''],
      l_strasse: [''],
      l_hausnummer: [''],
      l_plz: [''],
      l_stadt: [''],
      role: ['user']
    });
  }



  register() {
    if (this.registrationForm.valid) {
      // send registration data to server
      this.regi$ = this.authService.regiseter(this.registrationForm.value, this.dialogRef);
    }
  }
}
