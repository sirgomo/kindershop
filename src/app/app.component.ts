import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { AuthService } from './auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { HelperService } from './helper.service';
import { Router } from '@angular/router';
import { CategoriesService } from './admin/categories/categories.service';
import { LoaderService } from './loader/loader.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AppComponent implements OnInit{
@ViewChild('menu', {static: true}) menu!: MatMenu;
isInUserProfil: boolean = false;
isLogged$ = this.authServi.getIsLogged();
role$ = this.authServi.role$;
categories$ = new Observable<any>();


isInAdmin = false;
  constructor (private authServi: AuthService, private matDialog: MatDialog, private helper: HelperService,  private route: Router, private category: CategoriesService) {}
  ngOnInit(): void {
    this.categories$ = this.category.findAll();
    this.helper.setAppComponenet(this);
    this.isInAdmin = false;
    this.isInUserProfil = false;
    this.helper.setCategory(-1);
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
  this.isInAdmin = false;
}
goEinkaufen() {
  this.route.navigateByUrl('/');
  this.isInUserProfil = false;
  this.isInAdmin = false;
  }
goToAdmin() {
  this.route.navigateByUrl('admin');
  this.isInAdmin = true;
  this.isInUserProfil = false;
}
goToUser() {
  this.route.navigateByUrl('user');
  this.isInAdmin = false;
}
showItemsInCategory(catid: number | undefined) {
  if (catid !== undefined)
   this.helper.setCategory(catid);
  }
}
