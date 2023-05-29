import { Component } from '@angular/core';
import { WarenbuchungService } from './warenbuchung.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditBuchungComponent } from './edit-buchung/edit-buchung.component';
import { iBuchung } from 'src/app/model/iBuchung';

@Component({
  selector: 'app-warenbuchung',
  templateUrl: './warenbuchung.component.html',
  styleUrls: ['./warenbuchung.component.scss']
})
export class WarenbuchungComponent {
  buchungen$ = this.warenService.buchungs$;
  columns: string[] = ['id', 'liferschein', 'buchungdate', 'kreditor', 'gebucht', 'open'];
  constructor(private readonly warenService: WarenbuchungService, private readonly dialog: MatDialog) {}
  neueBuchung() {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '100%';
    conf.height = '100%';
    this.dialog.open(EditBuchungComponent, conf);
  }
  editBuchung(buchung: iBuchung) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '100%';
    conf.height = '100%';
    conf.data = buchung;
    this.dialog.open(EditBuchungComponent, conf);
  }
}
