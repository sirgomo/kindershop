import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { KreditorenService } from './kreditoren.service';
import { Observable, combineLatest, concatMap, map, merge, startWith, switchMap, tap } from 'rxjs';
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
  kreditoren$ = this.krediServi.kreditoren$;
  item$ = new Observable();
  diplayedColumns: string[] = ['id', 'knummer','name', 'tel', 'fax', 'email', 'edit', 'del'];

  constructor(private readonly krediServi: KreditorenService, private readonly dialog: MatDialog) {}
  ngOnInit(): void {
  this.kreditoren$ = this.krediServi.kreditoren$;
  }
  neueKreditor() {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '90%';
    this.item$ =  this.dialog.open(AddEditKreditorenComponent, conf).afterClosed().pipe();
    this.kreditoren$ = combineLatest([this.krediServi.kreditoren$, this.item$]).pipe(
      map(([kredi, item]) => {
        return kredi;
      })
    )
  }
  editKreditor(item: iKreditoren) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '90%';
    conf.data = item;
  this.item$ = this.dialog.open(AddEditKreditorenComponent, conf).afterClosed().pipe();
  this.kreditoren$ = combineLatest([this.krediServi.kreditoren$, this.item$]).pipe(
    map(([kredi, item]) => {
      return kredi;
    })
  )
  }
  deleteKreditor(id: number) {
    this.item$ = this.krediServi.deleteKreditor(id);
    this.kreditoren$ = combineLatest([this.krediServi.kreditoren$, this.item$]).pipe(
      map(([kredi, item]) => {
        return kredi;
      })
    )
  }
}
