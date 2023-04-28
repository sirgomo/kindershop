import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { ArtikelsService } from './artikels.service';

@Component({
  selector: 'app-artikles-admin',
  templateUrl: './artikles-admin.component.html',
  styleUrls: ['./artikles-admin.component.scss']
})
export class ArtiklesAdminComponent {

  displayedColumns: string[] = ['artid', 'aname', 'artikelmenge', 'availability', 'rating', 'categories', 'edit', 'delete'];
  artikel$ = new Observable<any>();

  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  constructor (private artikelServi: ArtikelsService) {}
  ngOnInit() {
    this.artikel$ = this.artikelServi.artikels$;
  }

  editArtikel(aname: string) {
    // Implement edit logic
  }

  deleteArtikel(artid: number) {
    // Implement delete logic
  }
}
