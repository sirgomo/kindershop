import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { IUser } from '../model/iuser';
import { HelperService } from '../helper.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit{

  user$!: Observable<any>;

  constructor(private userService: UserService, private helper: HelperService) {
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
}
