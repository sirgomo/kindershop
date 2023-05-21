import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EinkaufskorbService } from '../einkaufskorb.service';
import { Observable, tap } from 'rxjs';
import { IUser } from 'src/app/model/iUser';

@Component({
  selector: 'app-shippingaddress',
  templateUrl: './shippingaddress.component.html',
  styleUrls: ['./shippingaddress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingaddressComponent implements OnInit{
  @Output() setForm = new EventEmitter<FormGroup>;
  shippingaddress = false;
  user$: Observable<IUser> = new Observable<IUser>;
  addresForm: FormGroup;
  constructor(private fb: FormBuilder, private einkServicce: EinkaufskorbService) {
    this.addresForm = fb.group({
      shippingaddress: [false],
      email: ['', [Validators.required, Validators.email]],
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      strasse: ['', Validators.required],
      hausnummer: ['', Validators.required],
      plz: [Number, Validators.required],
      stadt: ['', Validators.required],
      l_nachname: [''],
      l_strasse: [''],
      l_hausnummer: [''],
      l_plz: [''],
      l_stadt: [''],
    })
  }
  ngOnInit(): void {
    if (localStorage.getItem('email') !== null) {
        this.user$ = this.einkServicce.getUserByEmail(localStorage.getItem('email')!).pipe(tap(
         (res) => {
         this.addresForm.patchValue(res);
         }
        ));
    }
  }
  sendDataToParrent() {
    this.setForm.emit(this.addresForm);
  }
}
