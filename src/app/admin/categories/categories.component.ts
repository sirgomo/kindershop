import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CategoriesService } from './categories.service';
import { Observable, map, tap } from 'rxjs';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddCategoryComponent } from './add-category/add-category.component';
import { HelperService } from 'src/app/helper.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit{
  categorie$ = this.catService.category$;
  displayedColumns: string[] = ['id', 'kategoria', 'ilosc', 'edytuj', 'usun'];
  constructor (private catService: CategoriesService, private dialog: MatDialog) {}
  ngOnInit(): void {
   this.categorie$ = this.catService.findAll();

  }


  createCategory() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.height = '200px'
    conf.width = '300px';

    this.categorie$ = this.dialog.open(AddCategoryComponent, conf).afterClosed().pipe(map((res) => {
    if(res === undefined) return this.catService.category$;
      return res;
    }));

  }

  editCategory(id:number, name: string) {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.height = '200px'
    conf.width = '300px';
    conf.data = [{id: id, name: name}];

    this.categorie$ =  this.dialog.open(AddCategoryComponent, conf).afterClosed().pipe(map((res) => {
      if(res === undefined) return this.catService.category$;

      return res;
    }));
  }

  deleteCategory(id:number) {
    this.categorie$  =  this.catService.delete(id);
  }
}
