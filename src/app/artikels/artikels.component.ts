import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ArtikelsService } from '../admin/artikles-admin/artikels.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-artikels',
  templateUrl: './artikels.component.html',
  styleUrls: ['./artikels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtikelsComponent implements OnInit{
  artikels$ = new Observable<any[]>();
  constructor (private artielSer: ArtikelsService) {}
  ngOnInit(): void {
    this.artikels$ = this.artielSer.getAllArtikel();
  }
  onAction() {}
  getImage(imgid: string) {
    return this.artielSer.getImage(imgid);
  }
}
