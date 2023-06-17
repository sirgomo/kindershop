import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BestellungDetailsComponent } from 'src/app/bestellung-details/bestellung-details.component';
import { EinkaufskorbService } from 'src/app/einkaufskorb/einkaufskorb.service';
import { HelperService } from 'src/app/helper.service';
import { BESTELLUNGSTATUS, iPaypalRes } from 'src/app/model/iPaypalRes';

@Component({
  selector: 'app-bestellungen-admin',
  templateUrl: './bestellungen-admin.component.html',
  styleUrls: ['./bestellungen-admin.component.scss']
})
export class BestellungenAdminComponent {
  isTransferDone = false;
  userEmail = '';
  bestellungStatus = Array.from(Object.keys(BESTELLUNGSTATUS));
  bestellungen$ = this.service.bestellungen$;
  column: string[] = ['id', 'edate', 'bstatus', 'bdate', 'price', 'steuer','brutto', 'vdate'];
    constructor(private readonly service: EinkaufskorbService, private readonly helper: HelperService,
      private readonly snackBar: MatSnackBar, private readonly route: Router, private readonly dialog: MatDialog) {

      }

showDetails(item: any) {
  const conf: MatDialogConfig = new MatDialogConfig();
  conf.width = '90%';
  conf.height= '90%';
  conf.data = item;

  this.dialog.open(BestellungDetailsComponent, conf);
}
onStatusChange(item: iPaypalRes) {

  if(item.id !== undefined)
  this.bestellungen$ = this.service.changeBestellungStatus({id: item.id, status: item.bestellung_status});
}
getBrutto(item: any) {
  return (Number(item.total_price) + Number(item.steuer)).toFixed(2);
}
}
