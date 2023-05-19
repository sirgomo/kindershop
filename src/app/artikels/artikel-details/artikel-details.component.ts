import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iArtikel } from 'src/app/model/iArtikel';

@Component({
  selector: 'app-artikel-details',
  templateUrl: './artikel-details.component.html',
  styleUrls: ['./artikel-details.component.scss']
})
export class ArtikelDetailsComponent {
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data : iArtikel, private dialRef : MatDialogRef<ArtikelDetailsComponent> ) {}

  close() {
    this.dialRef.close();
  }
  onAction() {

  }
}
