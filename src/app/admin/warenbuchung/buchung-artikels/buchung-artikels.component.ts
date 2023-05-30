import { Component, Input } from '@angular/core';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { ArtikelsService } from 'src/app/artikels/artikels.service';
import { HelperService } from 'src/app/helper.service';
import { iArtikelForBuchung } from 'src/app/model/iArtikelForBuchung';
import { iBuchungArtikel } from 'src/app/model/iBuchungArtikel';


@Component({
  selector: 'app-buchung-artikels',
  templateUrl: './buchung-artikels.component.html',
  styleUrls: ['./buchung-artikels.component.scss']
})
export class BuchungArtikelsComponent {
  @Input() buchungId: number = 0;
  displayedColumns: string[] = ['id', 'name', 'price', 'mwst', 'menge', 'add' ];
  artikels$ = combineLatest([this.helfer.searchItem$, this.helfer.liferantid$]).pipe(
    switchMap(([search, liferant]) => this.artikelSer.getArtikelsForBuchung(search, liferant)),
    map(res => {
      const items = res as iArtikelForBuchung[];
      let artikels : iBuchungArtikel[] = new Array(items.length);
      for (let i = 0; i < items.length; i++) {
        console.log(items[i])
        const item = {id: 0, artikels_id: items[i].id,
        buchung_id: this.buchungId, price: 0, mwst: 0, menge : 0,
         liferantid: items[i].liferant, name: items[i].name };
         artikels[i] = item;

      }
      return artikels;
    })
  )
  constructor( private artikelSer: ArtikelsService,
    private helfer: HelperService) {}

    addProduct(element: iBuchungArtikel) {
      console.log(element);
    }
}
