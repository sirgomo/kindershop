import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iBuchung } from 'src/app/model/iBuchung';
import { KreditorenService } from '../../kreditoren/kreditoren.service';
import { HelperService } from 'src/app/helper.service';
import { Observable, map } from 'rxjs';
import { WarenbuchungService } from '../warenbuchung.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-edit-buchung',
  templateUrl: './edit-buchung.component.html',
  styleUrls: ['./edit-buchung.component.scss'],
  providers: [DatePipe],
})
export class EditBuchungComponent {
  buchungForm: FormGroup;
  kreditoren$ = this.kreditor.kreditoren$;
  speichern$ = new Observable();
  minDate = new Date(Date.now());
  constructor(private readonly dialRef: MatDialogRef<EditBuchungComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data :iBuchung, private fb: FormBuilder,
  private kreditor: KreditorenService, private helper: HelperService, private buchungServ: WarenbuchungService, private readonly datePi: DatePipe) {
    this.buchungForm = this.fb.group({
      buchung_id: [this.data?.buchung_id || null ],
      lieferschein_id: [this.data?.lieferschein_id || '', Validators.required],
      liefer_date: [this.data?.liefer_date || Date, Validators.required],
      buchung_date: [this.data?.buchung_date || Date, Validators.required],
      gebucht: [this.data?.gebucht || Number, Validators.required],
      korrigiertes_nr: [this.data?.korrigiertes_nr || Number],
      korrigiertes_grund: [this.data?.korrigiertes_grund || ''],
      kreditor: [this.data?.kreditor || Number, Validators.required]
    });
  }
  submit(item: iBuchung) {
    if(this.data === null ) {
      if(item.artikels === undefined)
      item.artikels = [];

    const date = this.datePi.transform(item.buchung_date, 'yyyy-MM-dd');
    const date2 = this.datePi.transform(item.liefer_date, 'yyyy-MM-dd');
    if(date && date2) {
      item.buchung_date = date;
      item.liefer_date = date2;
    }

    this.speichern$ = this.buchungServ.createBuchung(item).pipe(
      map((res) => {
        this.data = res;
        this.buchungForm.patchValue(res);
      })
    )
    return;
    }

    if(this.data?.artikels)
    item.artikels = this.data.artikels;

  }
  close() {
    this.dialRef.close();
  }
  change() {
    this.buchungForm.get('gebucht')?.setValue(1);
    console.log(this.buchungForm)
  }
  liferantChange(liferantid: number) {
    this.helper.setLiferant(liferantid);
  }
}
