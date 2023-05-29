import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { EMPTY, Observable, combineLatest, map, startWith, switchMap } from 'rxjs';
import { ArtikelsService } from '../../artikels/artikels.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { iArtikel } from 'src/app/model/iArtikel';
import { AddEditArtikelComponent } from './add-edit-artikel/add-edit-artikel.component';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { HelperService } from 'src/app/helper.service';

@Component({
  selector: 'app-artikles-admin',
  templateUrl: './artikles-admin.component.html',
  styleUrls: ['./artikles-admin.component.scss']
})
export class ArtiklesAdminComponent {

  displayedColumns: string[] = ['artid', 'aname', 'artikelmenge', 'availability', 'rating', 'categories', 'edit', 'delete'];
  artikel$ = combineLatest([this.helper.artikelInCategory$, this.helper.artProSite$, this.helper.searchItem$, this.helper.siteNumber$]).pipe(
    switchMap(([ catid, artMenge, searchItem, siteNr]) => this.artikelServi.getAllArtikel(catid, Number(artMenge), searchItem, siteNr)),
   map((res) => {
     return res;
   }))

  addEditArtikel$ = new Observable();
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  constructor (private artikelServi: ArtikelsService, private matDialog: MatDialog, private helper: HelperService) {}

  addArtikel() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '80%';


    this.addEditArtikel$ = this.matDialog.open(AddEditArtikelComponent, conf).afterClosed().pipe(
      map((res) => {
        if(res === undefined) EMPTY;

        return res;
      })
    )
    this.artikel$ = combineLatest([this.artikel$, this.addEditArtikel$.pipe(startWith(null))]).pipe(
      map(([artikels, artikel]) => {
          return artikels;
      })
    )
  }
  editArtikel(art: iArtikel) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '80%';
    conf.data = art;

    this.addEditArtikel$ = this.matDialog.open(AddEditArtikelComponent, conf).afterClosed().pipe(
      map((res) => {
        if(res === undefined) return EMPTY;
        return res;
      })
    )
    this.artikel$ = combineLatest([this.artikel$, this.addEditArtikel$.pipe(startWith(null))]).pipe(
      map(([artikels, artikel]) => {
          return artikels;
      })
    )
  }

  deleteArtikel(artid: number) {
    this.artikel$ = this.artikelServi.deleteArtikel(artid);
  }
}
