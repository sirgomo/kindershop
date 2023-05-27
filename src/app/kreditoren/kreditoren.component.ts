import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { KreditorenService } from './kreditoren.service';
import { Observable } from 'rxjs';
import { iKreditoren } from '../model/iKreditoren';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditKreditorenComponent } from './add-edit-kreditoren/add-edit-kreditoren.component';

@Component({
  selector: 'app-kreditoren',
  templateUrl: './kreditoren.component.html',
  styleUrls: ['./kreditoren.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KreditorenComponent implements OnInit{
  kreditoren$ = new Observable<iKreditoren[]>;
  diplayedColumns: string[] = ['id', 'knummer','name', 'tel', 'fax', 'email', 'edit', 'del'];

  constructor(private readonly krediServi: KreditorenService, private readonly dialog: MatDialog) {}
  ngOnInit(): void {
    this.kreditoren$ = this.krediServi.getKreditors();
  }
  neueKreditor() {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '90%';


    this.dialog.open(AddEditKreditorenComponent, conf);
  }
  editKreditor(item: iKreditoren) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '90%';
    conf.data = item;
    this.dialog.open(AddEditKreditorenComponent, conf);
  }
  deleteKreditor(id: number) {

  }
}
