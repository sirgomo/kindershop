import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, finalize, map, of, scan, shareReplay, switchMap, take, tap, throwError } from 'rxjs';
import { iArtikel } from 'src/app/model/iArtikel';
import { environments } from 'src/environments/environment';
import { AddEditArtikelComponent } from '../admin/artikles-admin/add-edit-artikel/add-edit-artikel.component';
import { CategoriesService } from '../admin/categories/categories.service';
import { iCategory } from 'src/app/model/iCategory';
import { DomSanitizer } from '@angular/platform-browser';
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
  getAllArtikel(cat: number, artMengeProSite: number, searchItem: string, siteNr: number): Observable<iArtikel[]> {
    if( searchItem.length === 0) searchItem = '0';
    return this.http.get<iArtikel[]>(this.API+`/${cat}/${artMengeProSite}/${searchItem}/${siteNr}`).pipe(
      tap((res) => {
        if(res.length < 1) {
          this.snackBar.open('Keine Artikel gefunden', 'OK', { duration: 3000 });
        } else {
          this.artSubject.next(res);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const message = 'Fehler beim Laden der Artikel';
        this.snackBar.open(message, 'OK', { duration: 3000 });
        return throwError(() => message);
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
        const message = 'Fehler beim Laden der Artikel';
        this.snackBar.open(message, 'OK', { duration: 3000 });
        return throwError(() => message);
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
        const message = 'Fehler beim Erstellen des Artikels';
        this.snackBar.open(message, 'OK', { duration: 3000 });

        return throwError(() => message);
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
         return dialRef.close(this.artikels$);
        } else {
          const message = 'Fehler beim Aktualisieren des Artikels';
          this.snackBar.open( message, 'OK', { duration: 3000 });
          return throwError(() => message);
        }
      }),

      catchError((error: HttpErrorResponse) => {
        const message = 'Fehler beim Aktualisieren des Artikels';
          this.snackBar.open( message, 'OK', { duration: 3000 });
          return throwError(() => message);
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
          const message = 'Fehler beim Löschen des Artikels';
          this.snackBar.open(message, 'OK', { duration: 3000 });
          return throwError(() => message);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const message = 'Fehler beim Löschen des Artikels';
        this.snackBar.open(message, 'OK', { duration: 3000 });
        return throwError(() => message);
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
          const message = 'Bild konnte nicht gefunden werden';
          this.snackBar.open(message, 'OK', { duration: 3000 });
          return throwError(() => message);
        }
        const objectUrl = URL.createObjectURL(res);
        return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      }),
      catchError((error: HttpErrorResponse) => {
        const message = 'Fehler beim Laden des Bildes';
        this.snackBar.open(message, 'OK', { duration: 3000 });
        return throwError(() => message);
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
        const message = 'Fehler beim Hochladen des Bildes';
        this.snackBar.open(message, 'OK', { duration: 3000 });
        return throwError(() => message);
      })
    );
  }
}
