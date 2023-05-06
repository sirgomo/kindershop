import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, combineLatest, concatMap, finalize, map, merge, of, scan, shareReplay, switchMap, take, takeLast, tap } from 'rxjs';
import { environments } from 'src/environments/environment';
import { AddCategoryComponent } from './add-category/add-category.component';
import { iCategory } from 'src/app/model/icategory';
import { LoaderService } from 'src/app/loader/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private cat : BehaviorSubject<iCategory[]> = new BehaviorSubject<iCategory[]>([]);
  category$ = this.cat.asObservable();
  API = environments.API_URL+ 'category';
  constructor(private http: HttpClient, private loader: LoaderService, private snackBar: MatSnackBar) {}

  // Funktion zum Abrufen aller Kategorien
  findAll(): Observable<iCategory[]> {
    this.loader.setLoaderOn();
    return this.http.get<iCategory[]>(this.API).pipe(map(res => {
      if(res === undefined || res === null) {
        return [];
      }

      this.cat.next(res);
      return res;
    }), finalize(() => this.loader.setLoaderOff())
    );
  }

  // Funktion zum Hinzufügen einer Kategorie
  create(category: iCategory, dialogRef: MatDialogRef<AddCategoryComponent>): Observable<any> {
    this.loader.setLoaderOn();
    return this.http.post<iCategory>(this.API, category).pipe(map((res) => {
      if(res) {
        this.category$ =  combineLatest([this.category$, of([res])]).pipe(map(([cats, cat]) => {
          return [...cats, ...cat];
        }));
        this.snackBar.open('Kategorie erfolgreich hinzugefügt!', '', { duration: 3000 });
      }
      return dialogRef.close(this.category$);
    }),
    finalize(() => this.loader.setLoaderOff())
    );
  }

  // Funktion zum Aktualisieren einer Kategorie
  update(cat: iCategory, dialogRef: MatDialogRef<AddCategoryComponent>) {
    this.loader.setLoaderOn();
    return this.http.put(`${this.API}/${cat.id}`, cat).pipe(map(res => {
      if(res === 1) {
        this.category$ = this.category$.pipe(map((cats) => {
          cats.filter(item => item.id === cat.id).map(it => it.name = cat.name);
          return cats;
        }));
        this.snackBar.open('Kategorie erfolgreich aktualisiert!', '', { duration: 3000 });
      }
      return dialogRef.close(this.category$);
    }),
    finalize(() => this.loader.setLoaderOff())
    );
  }

  // Funktion zum Löschen einer Kategorie
  delete(id: number): Observable<any> {
    //TODO prüfen ob ich die kategorie löschen kann, vieleicht ist sie nicht leer!, dan disable delete
    this.loader.setLoaderOn();
    return this.http.delete(`${this.API}/${id}`).pipe(map((res) => {
      if(res === 1) {
        this.category$ = this.category$.pipe(map(cat => cat.filter((item) => item.id !== id)));
        this.snackBar.open('Kategorie erfolgreich gelöscht!', '', { duration: 3000 });
      }
      return this.category$;
    }),
    finalize(() => this.loader.setLoaderOff())
    );
  }

}
