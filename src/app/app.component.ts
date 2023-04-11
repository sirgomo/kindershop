import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { AuthService } from './auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
@ViewChild('menu', {static: true}) menu!: MatMenu;
isLogged = false;
  constructor (private authServi: AuthService, private matDialog: MatDialog) {}

login() {
  this.authServi.setAppComponet(this);
  const dialogConfig : MatDialogConfig = new MatDialogConfig();
  dialogConfig.height = '300px';
  dialogConfig.width = '400px';

  this.matDialog.open(LoginComponent, dialogConfig);
}
logout() {
  this.authServi.logout();
}
}
