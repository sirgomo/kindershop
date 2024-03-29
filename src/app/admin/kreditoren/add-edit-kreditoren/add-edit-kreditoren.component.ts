import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iKreditoren } from 'src/app/model/iKreditoren';
import { KreditorenService } from '../kreditoren.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-edit-kreditoren',
  templateUrl: './add-edit-kreditoren.component.html',
  styleUrls: ['./add-edit-kreditoren.component.scss']
})
export class AddEditKreditorenComponent {
  item$ = new Observable();
  kreditorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditKreditorenComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: iKreditoren,
    private readonly serv: KreditorenService
  ) {
    this.kreditorForm = this.fb.group({
      id: [ this.data?.id || undefined ],
      kreditorennummer: [this.data?.kreditorennummer || '', Validators.required],
      kreditorenname: [this.data?.kreditorenname || '', Validators.required],
      anschrift: [this.data?.anschrift || '', Validators.required],
      telefonnummer: [this.data?.telefonnummer || ''],
      faxnummer: [this.data?.faxnummer || ''],
      email: [this.data?.email || '', [Validators.email, Validators.required]],
      bankname: [this.data?.bankname || '', Validators.required],
      iban: [this.data?.iban || '', Validators.required],
      bic: [this.data?.bic || '', Validators.required],
      zahlungsbedingungen: [this.data?.zahlungsbedingungen || ''],
      steuernummer: [this.data?.steuernummer || ''],
      ust_idnr: [this.data?.ust_idnr || ''],
      land: [this.data?.land || '']
    });
   }


  saveKreditor(): void {
    if (this.kreditorForm.valid ) {
    this.item$ = this.serv.createKreditor(this.kreditorForm.value, this.dialogRef);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
