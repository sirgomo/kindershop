import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, combineLatest, map, of, scan, switchMap, take, tap } from 'rxjs';
import { iArtikel } from 'src/app/model/iArtikel';
import { environments } from 'src/environments/environment';
import { AddEditArtikelComponent } from './add-edit-artikel/add-edit-artikel.component';
import { CategoriesService } from '../categories/categories.service';
import { iCategory } from 'src/app/model/icategory';


@Injectable({
  providedIn: 'root'
})
export class ArtikelsService {

  private API = environments.API_URL + 'artikel';
  private artSubject: BehaviorSubject<iArtikel[]> = new BehaviorSubject<iArtikel[]>([]);
  artikels$ = this.artSubject.asObservable();
  categories$ = new Observable<iCategory[]>();
  constructor(private http: HttpClient, private catService: CategoriesService) {
    this.categories$ = this.catService.findAll();
  }

  getAllArtikel(): Observable<iArtikel[]> {
    return this.http.get<iArtikel[]>(this.API).pipe(
      tap((res) => {
        this.artSubject.next(res);
        return res;
      })
    );
  }

  getArtikelById(id: number): Observable<iArtikel> {
    return this.http.get<iArtikel>(`${this.API}/${id}`);
  }


  createArtikel(artikel: iArtikel, dialRef: MatDialogRef<AddEditArtikelComponent>): Observable<any> {
    return this.http.post<iArtikel>(this.API, artikel).pipe(
      switchMap((res) => {
        if(res.id !== undefined && res.id !== null) {
          return this.artikels$.pipe(
            map((artikels) => [...artikels, res])
          );
        } else {
          return this.artikels$;
        }
      }),
      tap((newArtikels) => {
        this.artSubject.next(newArtikels);
        dialRef.close(newArtikels);
      })
    );

  }

  updateArtikel(artikel: iArtikel, dialRef: MatDialogRef<AddEditArtikelComponent>): Observable<any> {


      return this.http.patch(`${this.API}/${artikel.id}`, artikel).pipe(
        map(res => {
          if(res === 1) {
           this.artikels$ = combineLatest([this.artikels$, of(artikel), this.categories$]).pipe(
              map(([arts, artikel, categories]) => {
                return arts.map((item) => {
                  if( item.id === artikel.id) {
                    item = artikel;
                    const foundCategory = categories.find((c) => c.id == artikel.categories[0].id);
                    if(foundCategory)
                    item.categories = [foundCategory];

                  }
                  return item;
                })
              })
            )
          }
          return dialRef.close(this.artikels$);
        })
        );
  }

  deleteArtikel(id: number): Observable<iArtikel[]> {
    return this.http.delete(`${this.API}/${id}`).pipe(
       switchMap( (res) => {
        if( res === 1) {
          this.artikels$ = this.artikels$.pipe(map(data => data.filter((item) => item.id !== id)));
        }
        return this.artikels$;
      })
    )
  }

}
