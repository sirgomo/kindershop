import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';
import { EinkaufskorbService } from 'src/app/einkaufskorb/einkaufskorb.service';
import { HelperService } from 'src/app/helper.service';

@Component({
  selector: 'app-bestellungen-admin',
  templateUrl: './bestellungen-admin.component.html',
  styleUrls: ['./bestellungen-admin.component.scss']
})
export class BestellungenAdminComponent {
  isTransferDone = false;

  userEmail = '';
  bestellungen$ = this.getBuchungen();
  column: string[] = ['id', 'edate', 'bstatus', 'bdate', 'price', 'steuer','brutto', 'vdate'];
    constructor(private readonly service: EinkaufskorbService, private readonly helper: HelperService,
      private readonly snackBar: MatSnackBar, private readonly route: Router, private readonly dialog: MatDialog) {
        this.helper.setBuchungen([]);
      }

getBuchungen() {





  return of([]);
}
showDetails(item: any) {
  const conf: MatDialogConfig = new MatDialogConfig();
  conf.width = '90%';
  conf.height= '90%';
  conf.data = item;


}
findBestellungen() {

}
getBrutto(item: any) {
  return (Number(item.total_price) + Number(item.steuer)).toFixed(2);
}
}
