import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iBuchung } from 'src/app/model/iBuchung';
import { iBuchungArtikel } from 'src/app/model/iBuchungArtikel';
import { KreditorenService } from '../../kreditoren/kreditoren.service';
import { HelperService } from 'src/app/helper.service';

@Component({
  selector: 'app-edit-buchung',
  templateUrl: './edit-buchung.component.html',
  styleUrls: ['./edit-buchung.component.scss']
})
export class EditBuchungComponent {
  buchungForm: FormGroup;
  kreditoren$ = this.kreditor.kreditoren$;
  artikels: iBuchungArtikel[] = [];
  constructor(private readonly dialRef: MatDialogRef<EditBuchungComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data :iBuchung, private fb: FormBuilder,
  private kreditor: KreditorenService, private helper: HelperService) {
    this.buchungForm = this.fb.group({
      buchung_id: [this.data?.buchung_id || Number, { disabled: true }],
      lieferschein_id: [this.data?.lieferschein_id || '', Validators.required],
      liefer_date: [this.data?.liefer_date || Date, Validators.required],
      buchung_date: [this.data?.buchung_date || Date, Validators.required],
      gebucht: [this.data?.gebucht || Number, Validators.required],
      korrigiertes_nr: [this.data?.korrigiertes_nr || Number],
      korrigiertes_grund: [this.data?.korrigiertes_grund || ''],
      kreditor: [this.data?.kreditor || Number, Validators.required]
    });
  }
  submit() {}
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
