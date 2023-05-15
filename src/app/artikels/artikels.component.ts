import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ArtikelsService } from '../admin/artikles-admin/artikels.service';
import { Observable, combineLatest, map } from 'rxjs';
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

  this.artikels$ =  combineLatest([this.artielSer.getAllArtikel(), this.helper.artikelInCategory$ ]).pipe(
    map(([arti, catid]) => {
          if(catid === -1) {
        return arti.filter((item) => item.categories[0].id !== -1);
      }
      return arti.filter((item) => item.categories[0].id === catid);
    }));
  }
  onAction() {}
  getImage(imgid: string) {
    return this.artielSer.getImage(imgid);
  }
}
