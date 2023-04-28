import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, combineLatest, concatMap, finalize, map, merge, of, scan, shareReplay, switchMap, take, takeLast, tap } from 'rxjs';
import { environments } from 'src/environments/environment';
import { AddCategoryComponent } from './add-category/add-category.component';
import { iCategory } from 'src/app/model/icategory';
import { LoaderService } from 'src/app/loader/loader.service';



@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private cat : BehaviorSubject<iCategory[]> = new BehaviorSubject<iCategory[]>([]);
  category$ = this.cat.asObservable();
  API = environments.API_URL+ 'category';
  constructor(private http: HttpClient, private loader: LoaderService) {}

  findAll(): Observable<iCategory[]> {
    this.loader.setLoaderOn();
    return this.http.get<iCategory[]>(this.API).pipe(map(res => {
    if(res === undefined || res === null) {
     return [];
    }

     this.cat.next(res);
    return res;
    }), shareReplay(1), finalize(() => this.loader.setLoaderOff())
    );
  }

  create(category: iCategory, dialogRef: MatDialogRef<AddCategoryComponent>): Observable<any> {
    this.loader.setLoaderOn();
    return this.http.post<iCategory>(this.API, category).pipe(map((res) => {
      if(res) {
       this.category$ =  combineLatest([this.category$, of([res])]).pipe(map(([cats, cat]) => {
        return [...cats, ...cat];
       }))
      }
      return dialogRef.close(this.category$);
    }),
    finalize(() => this.loader.setLoaderOff())
    );
  }

   update(cat: iCategory, dialogRef: MatDialogRef<AddCategoryComponent>) {
    this.loader.setLoaderOn();
    return this.http.put(`${this.API}/${cat.id}`, cat).pipe(map(res => {
      if(res === 1) {
        this.category$ = this.category$.pipe(map((cats) => {
          cats.filter(item => item.id === cat.id).map(it => it.name = cat.name);
          return cats;
        }))
      }
      return dialogRef.close(this.category$);
    }),
    finalize(() => this.loader.setLoaderOff())
    );
  }

  delete(id: number): Observable<any> {
    this.loader.setLoaderOn();
    return this.http.delete(`${this.API}/${id}`).pipe(map((res) => {
      if(res === 1) {
       return this.category$ = this.category$.pipe(map(cat => cat.filter((item) => item.id !== id)));
      }
      return this.category$;
    }),
    finalize(() => this.loader.setLoaderOff())
    )
  }

}
