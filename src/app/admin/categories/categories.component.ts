import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CategoriesService } from './categories.service';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddCategoryComponent } from './add-category/add-category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent  implements OnInit{
  categorie$ = this.catService.findAll();
  data = [];
  displayedColumns: string[] = ['id', 'kategoria', 'ilosc', 'edytuj', 'usun'];
  constructor (private catService: CategoriesService, private dialog: MatDialog) {}
  ngOnInit(): void {

  }

  createCategory() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.height = '200px'
    conf.width = '300px';
    this.dialog.open(AddCategoryComponent, conf);
        // kod do utworzenia nowej kategorii
  }

  editCategory(id:number, name: string) {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.height = '200px'
    conf.width = '300px';
    conf.data = [{id: id, name: name}];
    this.dialog.open(AddCategoryComponent, conf);
  }

  deleteCategory(id:number) {
    // kod do usunięcia kategorii
  }
}
