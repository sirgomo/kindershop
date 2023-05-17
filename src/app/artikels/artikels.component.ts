import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ArtikelsService } from './artikels.service';
import { Observable, combineLatest, map, startWith, switchMap } from 'rxjs';
import { HelperService } from '../helper.service';
import { iArtikel } from '../model/iArtikel';


@Component({
  selector: 'app-artikels',
  templateUrl: './artikels.component.html',
  styleUrls: ['./artikels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtikelsComponent implements OnInit{
  artikels$ =  new Observable<iArtikel[]>()
  constructor (private artielSer: ArtikelsService, private helper: HelperService) {}
  ngOnInit(): void {

 /* this.artikels$ =  combineLatest([this.artielSer.getAllArtikel(), this.helper.artikelInCategory$, this.helper.searchItem$ ]).pipe(
    map(([arti, catid, searchItem]) => {
          if(catid === -1) {
        return arti.filter((item) => item.categories[0].id !== -1);
      }
      return arti.filter((item) => item.categories[0].id === catid);
    }));*/
    this.artikels$ = combineLatest([this.helper.artikelInCategory$, this.helper.artProSite$, this.helper.searchItem$, this.helper.siteNumber$]).pipe(
         switchMap(([ catid, artMenge, searchItem, siteNr]) => this.artielSer.getAllArtikel(catid, Number(artMenge), searchItem, siteNr)),
        map((res) => {
          return res;
        })


    )
  }
  onAction() {}
  getImage(imgid: string) {
    return this.artielSer.getImage(imgid);
  }
}
