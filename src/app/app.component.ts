import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { AuthService } from './auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { HelperService } from './helper.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
@ViewChild('menu', {static: true}) menu!: MatMenu;
isInUserProfil: boolean = false;
isLogged$ = this.authServi.isloged$;
  constructor (private authServi: AuthService, private matDialog: MatDialog, private helper: HelperService,  private route: Router) {
    this.helper.setAppComponenet(this);
  }

login() {

  const dialogConfig : MatDialogConfig = new MatDialogConfig();
  dialogConfig.minHeight = '350px';
  dialogConfig.width = '400px';
  this.matDialog.open(LoginComponent, dialogConfig);
}
logout() {
  this.isInUserProfil = false;
  this.authServi.logout();
}
goEinkaufen() {
  this.route.navigateByUrl('/');
  this.isInUserProfil = false;
}
}
