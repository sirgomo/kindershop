import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iBuchung } from 'src/app/model/iBuchung';
import { KreditorenService } from '../../kreditoren/kreditoren.service';
import { HelperService } from 'src/app/helper.service';
import { BehaviorSubject, Observable, combineLatest, map, startWith, tap } from 'rxjs';
import { WarenbuchungService } from '../warenbuchung.service';
import { DatePipe } from '@angular/common';
import { iBuchungArtikel } from 'src/app/model/iBuchungArtikel';


@Component({
  selector: 'app-edit-buchung',
  templateUrl: './edit-buchung.component.html',
  styleUrls: ['./edit-buchung.component.scss'],
  providers: [DatePipe],
})
export class EditBuchungComponent {
  buchungForm: FormGroup;
  private kredi: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentCreditor$ = this.kredi.asObservable();

  item$ = new Observable<any>();


  artikels$ = new Observable();
  kreditoren$ = combineLatest([this.kreditor.kreditoren$, this.currentCreditor$]).pipe(
    map(([kreditoren, kredid])=> {
      if(this.data && this.data.kreditor.id) {
        const item = kreditoren.filter((tmp) => tmp.id === kredid)
        this.buchungForm.get('kreditor')?.setValue(item[0]);
      }
      return kreditoren;
    })
  )

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
      kreditor: [this.data?.kreditor || Object , Validators.required]
    });
    if(data !== null && this.data.kreditor.id !== undefined){
      if(this.data.buchung_id)
        this.item$ = this.buchungServ.getBuchungBeiId(this.data.buchung_id).pipe(
            map((res) => {

              this.helper.setArtikelInBuchung(res.artikels);
              return res;
            }))
      this.artikels$ = combineLatest([this.helper.artikelInBuchung$, this.item$.pipe(startWith(null))]).pipe(map(([artikels, item]) => {
          return artikels;
        }))

      this.kredi.next(this.data.kreditor.id);
    }

  }
  submit(item: iBuchung) {

    const date = this.datePi.transform(item.buchung_date, 'yyyy-MM-dd');
    const date2 = this.datePi.transform(item.liefer_date, 'yyyy-MM-dd');
    if(date && date2) {
      item.buchung_date = date;
      item.liefer_date = date2;
    }

    if(item.artikels === undefined)
    item.artikels = [];
    /* new Buchung */
    if(this.data === null ) {
    this.speichern$ = this.buchungServ.createBuchung(item).pipe(
      map((res) => {
        this.data = res;
        this.buchungForm.patchValue(res);
        if(res.kreditor.id !== undefined)
        this.kredi.next(res.kreditor.id);
      })
    )
    return;
    }
    /* edit Buchung */
    if(this.data?.artikels)
    item.artikels = this.data.artikels;

    this.speichern$ = this.buchungServ.editBuchung(item).pipe(
      map(res => {
        this.data = res;
        this.buchungForm.patchValue(res);
        if(res.kreditor.id !== undefined)
        this.kredi.next(res.kreditor.id);
      })
    )


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
  selectedTabIndex(event: any) {
    if(event.index === 1 && this.data !== null && this.data.kreditor.id !== undefined) {
      this.helper.setLiferant(this.data.kreditor.id);
    }
  }
}
