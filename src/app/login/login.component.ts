import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginDto = {   email: '', password: ''};
  tryLogin$ = this.authSer.token$;
    constructor (private authSer: AuthService, private dialRef: MatDialogRef<LoginComponent>, private snack: MatSnackBar) {}

    login() {
      if(this.loginDto.email.length < 5 || this.loginDto.password.length < 5) {
          this.snack.open('Das Email kann nicht kürzer sein als 5 Zeichen, genau wie das Kennwort.', 'Ok', { duration: 1500});
          return;
      }
    }
}
