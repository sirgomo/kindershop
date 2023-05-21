import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EinkaufskorbService } from './einkaufskorb.service';
import { tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-einkaufskorb',
  templateUrl: './einkaufskorb.component.html',
  styleUrls: ['./einkaufskorb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EinkaufskorbComponent {
  totalPrice : number = 0;
  isLoaged$ = this.auth.isloged$.pipe(tap((res) => {
    if (res)
      this.anonim = false
  }));
  anonim: boolean = false;
  isEditable = false;
  itemsInKorb$ = this.korbServ.artikelsInKorb$.pipe(tap((res) => {
    this.totalPrice = 0;
    for (let i = 0; i< res.length; i++) {
      this.totalPrice += Number(res[i].preis) * res[i].menge;
      this.totalPrice = Number(this.totalPrice.toFixed(2));
    }
  }));
  columns: string[] = ['id', 'name', 'size', 'preis', 'menge', 'delete'];

  constructor (private korbServ: EinkaufskorbService, private auth: AuthService, private matDialog: MatDialog,
    private locat: Location) {}

  deleteElement(id: number) {
    this.korbServ.deleteItem(id);
  }
  plusItem(itemid: number) {
    this.korbServ.changeMenge(itemid, 1);
  }
  minusItem(itemid: number) {
    this.korbServ.changeMenge(itemid, -1);
  }
  login() {

  const dialogConfig : MatDialogConfig = new MatDialogConfig();
  dialogConfig.minHeight = '350px';
  dialogConfig.width = '400px';
  dialogConfig.data = this.locat.path();
  this.matDialog.open(LoginComponent, dialogConfig);
  }
}
