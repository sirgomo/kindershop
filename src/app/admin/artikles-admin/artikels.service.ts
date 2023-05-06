import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, EMPTY, Observable, combineLatest, map, of, scan, shareReplay, switchMap, take, tap } from 'rxjs';
import { iArtikel } from 'src/app/model/iArtikel';
import { environments } from 'src/environments/environment';
import { AddEditArtikelComponent } from './add-edit-artikel/add-edit-artikel.component';
import { CategoriesService } from '../categories/categories.service';
import { iCategory } from 'src/app/model/icategory';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class ArtikelsService {

  private API = environments.API_URL + 'artikel';
  private artSubject: BehaviorSubject<iArtikel[]> = new BehaviorSubject<iArtikel[]>([]);
  artikels$ = this.artSubject.asObservable();
  categories$ = new Observable<iCategory[]>();
  constructor(private http: HttpClient, private catService: CategoriesService,
    private sanitizer: DomSanitizer) {
    this.categories$ = this.catService.findAll();
  }

  getAllArtikel(): Observable<iArtikel[]> {
    return this.http.get<iArtikel[]>(this.API).pipe(
      tap((res) => {
        if(res.length < 1) return null;

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
  getImage(image: string) {

    return this.http.get(this.API + '/bilder/' + image, { responseType: 'blob' }).pipe(map((res) => {
    if(!res.size) return EMPTY;

    console.log(res);
    const objectUrl = URL.createObjectURL(res);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    }))

  }
  sendImageToServer(image: FormData): Observable<any> {
    return this.http.post(this.API+'/image', image, {
      reportProgress: true,
      observe: 'events'
    })
    .pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress: {
            if(event.total !== undefined) {
              const percentDone = Math.round((100 * event.loaded) / event.total);
              console.log(`File is ${percentDone}% uploaded`);
              return { progress: 'loading', message: percentDone };
            }
            return 'Error'
          }
          case HttpEventType.Response: {
            console.log('File uploaded successfully ' + Object(event.body).path);
            return { progress: 'loaded', message: Object(event.body).path.split('/')[1] };
          }
          default: {
            return EMPTY;
          }
        }
      })
    );
  }
}
