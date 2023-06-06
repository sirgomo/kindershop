 /**
 * Komponente für die Anzeige und Auswahl von Artikeln für eine Warenbuchung.
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { ArtikelsService } from 'src/app/artikels/artikels.service';
import { HelperService } from 'src/app/helper.service';
import { iArtikelForBuchung } from 'src/app/model/iArtikelForBuchung';
import { iBuchungArtikel } from 'src/app/model/iBuchungArtikel';
import { WarenbuchungService } from '../warenbuchung.service';


@Component({
  selector: 'app-buchung-artikels',
  templateUrl: './buchung-artikels.component.html',
  styleUrls: ['./buchung-artikels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuchungArtikelsComponent {
  @Input() buchungId?: number;
  displayedColumns: string[] = ['id', 'name', 'price', 'mwst', 'menge', 'add' ];
    // Observable für die Anzeige der Artikelliste
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
   // Observable für das Hinzufügen eines Artikels zur Buchung
  addArtikel$ = new Observable();
  constructor( private artikelSer: ArtikelsService,
    private helfer: HelperService, private readonly snackBar: MatSnackBar, private buchungServ: WarenbuchungService) {}
  /**
   * Fügt einen ausgewählten Artikel zur aktuellen Buchung hinzu.
   * @param element Der ausgewählte Artikel
   */
    addProduct(element: iBuchungArtikel) {
       // Wenn keine Buchung vorhanden ist, kann auch kein Artikel hinzugefügt werden
      if(this.buchungId === null) {
        this.snackBar.open('Das buchung musst zuerst gespeichert werden', 'ok', { duration: 5000 })
        return;
      }
      if(this.buchungId)
      element.buchung_id = this.buchungId;

      this.addArtikel$ = this.buchungServ.addArtikel(element).pipe(tap((res) => {
    // Wenn der Artikel nicht erfolgreich zur Buchung hinzugefügt werden konnte, wird eine Fehlermeldung ausgegeben
        if (res.buchung_id !== this.buchungId) {
          const err = new Error();
          Object.assign(err, res);
          this.snackBar.open(err.message, 'Ok', {duration: 5000})
          return;
        }
         // Wenn der Artikel erfolgreich zur Buchung hinzugefügt wurde, wird eine Bestätigung ausgegeben
        this.snackBar.open('Buchung gespeichert', 'Ok', {duration: 2000})
        const curentItems = this.helfer.getArtikelsInBuchung();
         // Wenn der Artikel bereits in der Buchung vorhanden war, wird der Eintrag in der Buchungsliste aktualisiert
          if(element.id) {
            const index = curentItems.findIndex((item) => item.id === res.id);
            const tmpItems = curentItems.slice(0);
            const newItem = {
              ...element,
              ...res
            }
          tmpItems[index] = {...curentItems[index], ...newItem};
          this.helfer.setArtikelInBuchung(tmpItems);
          this.artikels$ = of(tmpItems);
          return;
        }
        // Wenn der Artikel neu zur Buchung hinzugefügt wurde, wird er in der Buchungsliste hinzugefügt
        element.id = res.id;
        this.helfer.setArtikelInBuchung([...curentItems, element]);
        this.artikels$ = of([...curentItems, element]);
      }));
    }

}
