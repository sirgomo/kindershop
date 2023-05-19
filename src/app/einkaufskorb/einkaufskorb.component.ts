import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EinkaufskorbService } from './einkaufskorb.service';

@Component({
  selector: 'app-einkaufskorb',
  templateUrl: './einkaufskorb.component.html',
  styleUrls: ['./einkaufskorb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EinkaufskorbComponent {
  itemsInKorb$ = this.korbServ.artikelsInKorb$;
  columns: string[] = ['id', 'name', 'size', 'price'];
  constructor (private korbServ: EinkaufskorbService) {}

}
