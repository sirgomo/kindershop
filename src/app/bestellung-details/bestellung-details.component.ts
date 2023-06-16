import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { EinkaufskorbService } from '../einkaufskorb/einkaufskorb.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iPaypalRes } from '../model/iPaypalRes';
import { FirmaDaten } from '../admin/firmaDaten';
import { iKorbItem } from '../model/iKorbItem';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-bestellung-details',
  templateUrl: './bestellung-details.component.html',
  styleUrls: ['./bestellung-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestellungDetailsComponent {
  firma = new FirmaDaten();
  artikels: iKorbItem[] = [];
  data$: Observable<iPaypalRes> = this.service.getBestellungBeiId(this.data.id).pipe(
    map(res => {
      this.artikels = JSON.parse(res.artikels_list);
      return res;
    })
  );
  constructor (private readonly service: EinkaufskorbService, @Inject(MAT_DIALOG_DATA) public data: iKorbItem) {}
  getNetto() {
    let preise = 0;
    for (let i = 0; i < this.artikels.length; i++) {
      preise += this.artikels[i].preis * this.artikels[i].menge;
    }
    return preise.toFixed(2);
  }
  getMwst() {
    let mwst = 0;
    for (let i = 0; i < this.artikels.length; i++) {
      mwst += ((this.artikels[i].preis * this.artikels[i].mwst / 100)  * this.artikels[i].menge);
    }
    return mwst.toFixed(2);
  }
  getBrutto() {
    return Number(this.getNetto()) + Number(this.getMwst());
  }
}
