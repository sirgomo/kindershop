import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriesService } from '../categories.service';
import { iCategory } from 'src/app/model/icategory';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/helper.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit{
  categoryName: string = '';
  add$! : Observable<any>;

  constructor ( private dialRef: MatDialogRef<AddCategoryComponent>, private catServ: CategoriesService , @Optional() @Inject(MAT_DIALOG_DATA) public data: {id: number; name: string}[] ) {}
  ngOnInit(): void {

    if(this.data !== null) {
      this.categoryName = this.data[0].name;
    }
  }

  save() {
    const cat : iCategory = { id: undefined, name: this.categoryName};
    this.add$ = this.catServ.create(cat, this.dialRef);
      }
  update() {
    const cat : iCategory = { id: this.data[0].id, name: this.categoryName};
    this.add$ = this.catServ.update(cat, this.dialRef);
  }
  abort() {
    this.dialRef.close();
  }
}
