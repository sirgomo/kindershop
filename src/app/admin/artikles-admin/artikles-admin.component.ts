import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { EMPTY, Observable, combineLatest, map } from 'rxjs';
import { ArtikelsService } from '../../artikels/artikels.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { iArtikel } from 'src/app/model/iArtikel';
import { AddEditArtikelComponent } from './add-edit-artikel/add-edit-artikel.component';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';

@Component({
  selector: 'app-artikles-admin',
  templateUrl: './artikles-admin.component.html',
  styleUrls: ['./artikles-admin.component.scss']
})
export class ArtiklesAdminComponent {

  displayedColumns: string[] = ['artid', 'aname', 'artikelmenge', 'availability', 'rating', 'categories', 'edit', 'delete'];
  artikel$ = this.artikelServi.artikels$;
  addEditArtikel$ = new Observable();
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  constructor (private artikelServi: ArtikelsService, private matDialog: MatDialog) {}
  ngOnInit() {
  //  this.artikel$ = this.artikelServi.getAllArtikel(-1,50,'',1);

  }
  addArtikel() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '80%';


    this.addEditArtikel$ = this.matDialog.open(AddEditArtikelComponent, conf).afterClosed().pipe(
      map((res) => {
        if(res === undefined) EMPTY;

        return res;
      })
    )
    this.artikel$ = combineLatest([this.artikelServi.artikels$, this.addEditArtikel$]).pipe(
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
    this.artikel$ = combineLatest([this.artikelServi.artikels$, this.addEditArtikel$]).pipe(
      map(([artikels, artikel]) => {
          return artikels;
      })
    )
  }

  deleteArtikel(artid: number) {
    this.artikel$ = this.artikelServi.deleteArtikel(artid);
  }
}
