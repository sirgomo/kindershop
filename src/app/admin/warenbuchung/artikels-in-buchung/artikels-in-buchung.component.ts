import { Component } from '@angular/core';
import { Observable, combineLatest, tap } from 'rxjs';
import { HelperService } from 'src/app/helper.service';
import { WarenbuchungService } from '../warenbuchung.service';
import { iBuchungArtikel } from 'src/app/model/iBuchungArtikel';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-artikels-in-buchung',
  templateUrl: './artikels-in-buchung.component.html',
  styleUrls: ['./artikels-in-buchung.component.scss'],

})
export class ArtikelsInBuchungComponent {
  showColumns: string[] = ['artid', 'artname', 'einzpreis','mwst', 'menge', 'gesamtpreis', 'gesamtmwst', 'delete'];
  artikels$ = this.helper.artikelInBuchung$;
  action$ = new Observable();
  constructor(private readonly helper: HelperService, private buchService: WarenbuchungService, private snackBar: MatSnackBar) {}

  getGesamtePreisForArtikelNetto(index: number) {
    const artikels = this.helper.getArtikelsInBuchung();
    return artikels[index].menge * artikels[index].price;
  }
  getGesamtMwst(index: number) {
    const artikels = this.helper.getArtikelsInBuchung();
    return (artikels[index].price * artikels[index].mwst / 100) * artikels[index].menge;
  }
  getGesamtBruttoPreis() {
    const artikels = this.helper.getArtikelsInBuchung();
    let preis = 0;
    let mwst = 0;
    for (let i = 0; i < artikels.length; i++) {
      preis += this.getGesamtePreisForArtikelNetto(i);
      mwst += this.getGesamtMwst(i);
    }
    return [preis.toFixed(2), mwst.toFixed(2), (preis+mwst).toFixed(2)];
  }
  deleteItem(item: iBuchungArtikel) {
    if(item.id)
    this.action$ = this.buchService.deleteArtikelFromBuchung(item.id, item.buchung_id).pipe(
      tap((res) => {
        if(res !== 1) {
          const err = new Error();
          Object.assign(err, res)
          this.snackBar.open(err.message, 'Ok', { duration: 4000})
        }

        const artikels = this.helper.getArtikelsInBuchung();
        const tmpar  = artikels.filter((tmp) => item.id !== tmp.id );
        this.helper.setArtikelInBuchung(tmpar);
        this.snackBar.open('Item wurde entfernt', 'Ok', {duration: 2000})
      })
    );
  }

}
