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

}
