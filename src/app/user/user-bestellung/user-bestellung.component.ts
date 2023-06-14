import { identifierName } from '@angular/compiler';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { combineLatest, map, of, shareReplay, tap } from 'rxjs';
import { EinkaufskorbService } from 'src/app/einkaufskorb/einkaufskorb.service';
import { HelperService } from 'src/app/helper.service';
import { iPaypalRes } from 'src/app/model/iPaypalRes';

@Component({
  selector: 'app-user-bestellung',
  templateUrl: './user-bestellung.component.html',
  styleUrls: ['./user-bestellung.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBestellungComponent {
  isTransferDone = false;

  userEmail = '';
  bestellungen$ = this.getBuchungen();
  column: string[] = ['id', 'edate', 'bstatus', 'bdate', 'price', 'steuer', 'vdate'];
    constructor(private readonly service: EinkaufskorbService, private readonly helper: HelperService,
      private readonly snackBar: MatSnackBar, private readonly route: Router, private readonly dialog: MatDialog) {
        this.helper.setBuchungen([]);
      }

getBuchungen() {
  const email = localStorage.getItem('email')
  if(email !== null) {
    return this.service.getBestellungBeiEmail(email).pipe(map(res => {

      this.isTransferDone = true;
      this.helper.setBuchungen(res);
      return res as iPaypalRes[];
    }));


  }

  this.snackBar.open('Email wurde nicht gefunden!', 'Ok', {duration: 3000});
  this.route.navigateByUrl('/');
  return of([]);
}
showDetails(item: any) {
  console.log(item)
}
findBestellungen() {
 const items$ =  this.service.getBestellungBeiEmail(this.userEmail).pipe(map(res => {
    if(res === null) return [];


    this.helper.setBuchungen(res);
    return res;
  }))
  this.bestellungen$ = combineLatest([this.bestellungen$, items$]).pipe(map(([best, items]) => {
      console.log(items)
      return items;
  }))
}
}
