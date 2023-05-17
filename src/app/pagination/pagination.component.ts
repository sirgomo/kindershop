import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit{
  siteNr = 1;
  artikelMengeProSite = 10;
  constructor (private helper: HelperService) {}
  ngOnInit(): void {
    this.helper.setSiteNumber(this.siteNr);
  }

  setSiteNr(siteNr: number) {
    this.siteNr += siteNr;
    this.helper.setSiteNumber(this.siteNr);
  }
  setArtikelMengeOnSite() {
    this.helper.setItemMengeProSite(this.artikelMengeProSite);
  }
}
