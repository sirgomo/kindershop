import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginDto = {   email: '', password: ''};
  tryLogin$: Observable<any> = of('Login');
    constructor (private authSer: AuthService, private dialRef: MatDialogRef<LoginComponent>, private snack: MatSnackBar,
     private matDialog: MatDialog) {}

    login() {
      if(this.loginDto.email.length < 5 || this.loginDto.password.length < 5) {
          this.snack.open('Das Email kann nicht kürzer sein als 5 Zeichen, genau wie das Kennwort.', 'Ok', { duration: 1500});
          return;
      }
     this.tryLogin$ = this.authSer.login(this.loginDto, this.dialRef);
    }
    register() {
      const dialogConfig : MatDialogConfig = new MatDialogConfig();
      dialogConfig.height = '60%';
      dialogConfig.width = '50%';

      this.matDialog.open(RegisterComponent, dialogConfig);
    }
}
