import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ArtikelsService } from './artikels.service';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { HelperService } from '../helper.service';
import { iArtikel } from '../model/iArtikel';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ArtikelDetailsComponent } from './artikel-details/artikel-details.component';
import { EinkaufskorbService } from '../einkaufskorb/einkaufskorb.service';


@Component({
  selector: 'app-artikels',
  templateUrl: './artikels.component.html',
  styleUrls: ['./artikels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtikelsComponent implements OnInit{
  artikels$ =  new Observable<iArtikel[]>()
  constructor (private artielSer: ArtikelsService, private helper: HelperService, private dialog: MatDialog, private korbServ: EinkaufskorbService) {}
  ngOnInit(): void {

    this.artikels$ = combineLatest([this.helper.artikelInCategory$, this.helper.artProSite$, this.helper.searchItem$, this.helper.siteNumber$]).pipe(
         switchMap(([ catid, artMenge, searchItem, siteNr]) => this.artielSer.getAllArtikel(catid, Number(artMenge), searchItem, siteNr)),
        map((res) => {
          return res;
        })


    )
  }
  onAction(item: iArtikel) {
    this.korbServ.addArtikelToKorb(item);
  }
  showDetails(item: iArtikel) {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.data = item;
    conf.width = '70%'

    this.dialog.open(ArtikelDetailsComponent, conf);
  }
  getImage(imgid: string) {
    return this.artielSer.getImage(imgid);
  }
  getPriceWithMwSt(item: iArtikel) {
    console.log(typeof item.price + ' / ' + typeof item.mwst)
    let price = Number(item.price) + (Number(item.price) * item.mwst / 100);
    return price.toFixed(2);
  }
}
