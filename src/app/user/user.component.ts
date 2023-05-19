import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Observable, combineLatest, concatMap, map, switchMap, tap } from 'rxjs';
import { IUser } from '../model/iUser';
import { HelperService } from '../helper.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit{

  user$!: Observable<any>;
  changePass$!: Observable<any>;

  constructor(private userService: UserService, private helper: HelperService, private dialog: MatDialog) {
    this.helper.getAppComponent().isInUserProfil = true;
   }

  ngOnInit() {
    const userId = localStorage.getItem('email');
    if(userId !== null) {
      this.user$ = this.userService.getUserById(userId);
    }

  }

  updateUser(user: IUser) {
    const userId = localStorage.getItem('userid');
    this.user$ = this.userService.updateUser(Number(userId), user);
  }
  changePassword() {
      const conf : MatDialogConfig = new MatDialogConfig();
      conf.width = '300px';

      this.dialog.open(ChangePasswordComponent, conf);
  }
}
