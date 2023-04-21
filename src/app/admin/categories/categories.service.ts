import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environments } from 'src/environments/environment';
import { AddCategoryComponent } from './add-category/add-category.component';
import { iCategory } from 'src/app/model/icategory';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {


  API = environments.API_URL+ 'category';
  constructor(private http: HttpClient) { }

 async findAll() {
  //return of(['kein Data']);
   console.log('finda all')
    return await this.http.get<any[]>(this.API).pipe(map(res => {
    if(res === undefined || res === null) {
     return [];
    }
      console.log('res ' + res);
    return res ;
    }));
  }

  create(category: iCategory, dialogRef: MatDialogRef<AddCategoryComponent>) {
    dialogRef.close();
    return this.http.post(this.API, category).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  update(id:number, category: string) {
    return this.http.put(`${this.API}/${id}`, category);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
