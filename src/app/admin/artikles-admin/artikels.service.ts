import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, finalize, map, of, scan, shareReplay, switchMap, take, tap } from 'rxjs';
import { iArtikel } from 'src/app/model/iArtikel';
import { environments } from 'src/environments/environment';
import { AddEditArtikelComponent } from './add-edit-artikel/add-edit-artikel.component';
import { CategoriesService } from '../categories/categories.service';
import { iCategory } from 'src/app/model/icategory';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from 'src/app/loader/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';


/**
 * Service für Artikel-Operationen.
 */
@Injectable({
  providedIn: 'root'
})
export class ArtikelsService {

  private API = environments.API_URL + 'artikel';
  private artSubject: BehaviorSubject<iArtikel[]> = new BehaviorSubject<iArtikel[]>([]);
  artikels$ = this.artSubject.asObservable();
  categories$ = new Observable<iCategory[]>();

  constructor(private http: HttpClient, private catService: CategoriesService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar) {
    this.categories$ = this.catService.findAll();
  }

  /**
   * Holt alle Artikel vom Server.
   * @returns Eine Observable für die Liste der Artikel.
   */
  getAllArtikel(): Observable<iArtikel[]> {

    return this.http.get<iArtikel[]>(this.API).pipe(
      tap((res) => {
        if(res.length < 1) {
          this.snackBar.open('Keine Artikel gefunden', 'OK', { duration: 3000 });
        } else {
          this.artSubject.next(res);
        }
      }),
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Fehler beim Laden der Artikel', 'OK', { duration: 3000 });
        return EMPTY;
      })
    );
  }

  /**
   * Holt einen Artikel vom Server anhand der ID.
   * @param id Die ID des zu holenden Artikels.
   * @returns Eine Observable für den Artikel.
   */
  getArtikelById(id: number): Observable<iArtikel> {
    return this.http.get<iArtikel>(`${this.API}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Fehler beim Laden des Artikels', 'OK', { duration: 3000 });
        return EMPTY;
      })
    );
  }

  /**
   * Erstellt einen neuen Artikel auf dem Server.
   * @param artikel Der zu erstellende Artikel.
   * @param dialRef Das Dialog-Referenzobjekt für die Schließung des Dialogs.
   * @returns Eine Observable für den aktualisierten Artikel-Array.
   */
  createArtikel(artikel: iArtikel, dialRef: MatDialogRef<AddEditArtikelComponent>): Observable<any> {

    return this.http.post<iArtikel>(this.API, artikel).pipe(
      switchMap((res) => {
        if(res.id !== undefined && res.id !== null) {
          return this.artikels$.pipe(
            map((artikels) => {
              res.menge = 0;
             return [...artikels, res]
            })
          );
        } else {
          return this.artikels$;
        }
      }),
      tap((newArtikels) => {
        this.artSubject.next(newArtikels);

        dialRef.close(newArtikels);
      }),
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Fehler beim Erstellen des Artikels', 'OK', { duration: 3000 });

        return EMPTY;
      })
    );
  }

  /**
   * Aktualisiert einen Artikel auf dem Server.
   * @param artikel Der zu aktualisierende Artikel.
   * @param dialRef Das Dialog-Referenzobjekt für die Schließung des Dialogs.
   * @returns Eine Observable für den aktualisierten Artikel-Array.
   */
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
          dialRef.close(this.artikels$);
        } else {
          this.snackBar.open('Fehler beim Aktualisieren des Artikels', 'OK', { duration: 3000 });
        }
      }),

      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Fehler beim Aktualisieren des Artikels', 'OK', { duration: 3000 });

        return EMPTY;
      })
    );
  }

  /**
   * Löscht einen Artikel auf dem Server.
   * @param id Die ID des zu löschenden Artikels.
   * @returns Eine Observable für den aktualisierten Artikel-Array.
   */
  deleteArtikel(id: number): Observable<iArtikel[]> {
    return this.http.delete(`${this.API}/${id}`).pipe(
      switchMap( (res) => {
        if(res === 1) {
          this.artikels$ = this.artikels$.pipe(map(data => data.filter((item) => item.id !== id)));
          return this.artikels$;
        } else {
          this.snackBar.open('Fehler beim Löschen des Artikels', 'OK', { duration: 3000 });
          return EMPTY;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Fehler beim Löschen des Artikels', 'OK', { duration: 3000 });
        return EMPTY;
      })
    )
  }

  /**
   * Holt ein Bild vom Server anhand des Bildnamens.
   * @param image Der Name des Bildes.
   * @returns Eine Observable für das Bild als sicheres URL-Objekt.
   */
  getImage(image: string) {
    return this.http.get(this.API + '/bilder/' + image, { responseType: 'blob' }).pipe(
      map((res) => {
        if(!res.size) {
          this.snackBar.open('Bild konnte nicht gefunden werden', 'OK', { duration: 3000 });
          return EMPTY;
        }
        const objectUrl = URL.createObjectURL(res);
        return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      }),
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Fehler beim Laden des Bildes', 'OK', { duration: 3000 });
        return EMPTY;
      })
    )
  }

  /**
   * Sendet ein Bild an den Server zum Speichern.
   * @param image Das FormData-Objekt mit dem Bild.
   * @returns Eine Observable für den Fortschritt oder das Ergebnis des Uploads.
   */
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
              return { progress: 'loading', message: percentDone };
            }
            return 'Error'
          }
          case HttpEventType.Response: {

            return { progress: 'loaded', message: Object(event.body).path.split('/')[1] };
          }
          default: {
            return EMPTY;
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Fehler beim Hochladen des Bildes', 'OK', { duration: 3000 });
        return EMPTY;
      })
    );
  }
}
