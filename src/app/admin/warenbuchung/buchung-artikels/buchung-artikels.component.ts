import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { ArtikelsService } from 'src/app/artikels/artikels.service';
import { HelperService } from 'src/app/helper.service';
import { iArtikelForBuchung } from 'src/app/model/iArtikelForBuchung';
import { iBuchungArtikel } from 'src/app/model/iBuchungArtikel';
import { WarenbuchungService } from '../warenbuchung.service';


@Component({
  selector: 'app-buchung-artikels',
  templateUrl: './buchung-artikels.component.html',
  styleUrls: ['./buchung-artikels.component.scss']
})
export class BuchungArtikelsComponent {
  @Input() buchungId?: number;
  displayedColumns: string[] = ['id', 'name', 'price', 'mwst', 'menge', 'add' ];
  artikels$ = combineLatest([this.helfer.searchItem$, this.helfer.liferantid$]).pipe(
    switchMap(([search, liferant]) => this.artikelSer.getArtikelsForBuchung(search, liferant)),
    map(res => {
      const items = res as iArtikelForBuchung[];
      const artikelInBuch = this.helfer.getArtikelsInBuchung();
      if(items.length < 1) return of([]);


      let artikels : iBuchungArtikel[] = new Array(items.length);
      for (let i = 0; i < items.length; i++) {
        if(artikelInBuch.length === 0) {
          const item = {id: 0, artikels_id: items[i].id,
            buchung_id: 0, price: 0, mwst: 0, menge : 0,
             liferantid: items[i].liferant, name: items[i].name };
             artikels[i] = item;
        } else {

          const index = artikelInBuch.findIndex((item) => item.artikels_id === items[i].id);
          if (index !== -1) {
            const item = {id: artikelInBuch[index].id, artikels_id: items[i].id,
              buchung_id: artikelInBuch[index].buchung_id, price: artikelInBuch[index].price, mwst: artikelInBuch[index].mwst, menge : artikelInBuch[index].menge,
              liferantid: items[i].liferant, name: items[i].name };
              artikels[i] = item;
          } else {
            const item = {id: 0, artikels_id: items[i].id,
              buchung_id: 0, price: 0, mwst: 0, menge : 0,
              liferantid: items[i].liferant, name: items[i].name };
              artikels[i] = item;
          }
        }
      }
      return artikels;
    })
  )
  addArtikel$ = new Observable();
  constructor( private artikelSer: ArtikelsService,
    private helfer: HelperService, private readonly snackBar: MatSnackBar, private buchungServ: WarenbuchungService) {}

    addProduct(element: iBuchungArtikel) {

      if(this.buchungId === null) {
        this.snackBar.open('Das buchung musst zuerst gespeichert werden', 'ok', { duration: 5000 })
        return;
      }
      if(this.buchungId)
      element.buchung_id = this.buchungId;

      this.addArtikel$ = this.buchungServ.addArtikel(element).pipe(tap((res) => {

        if (res.buchung_id !== this.buchungId) {
          const err = new Error();
          Object.assign(err, res);
          this.snackBar.open(err.message, 'Ok', {duration: 5000})
          return;
        }

        this.snackBar.open('Buchung gespeichert', 'Ok', {duration: 2000})
        const curentItem = this.helfer.getArtikelsInBuchung();
        const index = curentItem.findIndex((item) => item.id === res.id);
        const tmpItems = curentItem.slice(0);
        tmpItems[index] = res;
        this.helfer.setArtikelInBuchung(tmpItems);
      }));
    }
}
