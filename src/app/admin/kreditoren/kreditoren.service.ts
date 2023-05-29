import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, shareReplay, switchMap } from 'rxjs';
import { environments } from 'src/environments/environment';
import { iKreditoren } from 'src/app/model/iKreditoren'
import { MatDialogRef } from '@angular/material/dialog';
import { AddEditKreditorenComponent } from './add-edit-kreditoren/add-edit-kreditoren.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class KreditorenService {
  kreditoren: BehaviorSubject<iKreditoren[]> = new BehaviorSubject<iKreditoren[]>([]);
  kreditoren$ = this.kreditoren.asObservable().pipe(switchMap((res) => {

    if(res.length === 0)
      return this.getKreditors();

      return of(res);
  }), shareReplay(1));
  API = environments.API_URL + 'kreditoren'
  constructor(private readonly http: HttpClient, private snck: MatSnackBar) { }
 /*
* Diese Funktion ruft die Liste der Kreditoren über die API ab und gibt sie als Observable zurück.
* Wenn es bereits eine Liste von Kreditoren gibt, wird diese zurückgegeben, ansonsten wird die Liste über die API abgerufen.
*/
  getKreditors(): Observable<iKreditoren[]> {
    return this.http.get<iKreditoren[]>(this.API).pipe(map((res) => {
      this.kreditoren.next(res);
      return res;
    }))
  }
/*
* Diese Funktion erstellt einen neuen Kreditor über die API und fügt ihn der Liste der Kreditoren hinzu.
* Wenn das Erstellen erfolgreich war, wird der neue Kreditor an die Liste angehängt und das Dialogfenster geschlossen.
* Wenn das Erstellen nicht erfolgreich war, wird eine Fehlermeldung angezeigt und das Dialogfenster bleibt geöffnet.
*/
  createKreditor(kreditor : iKreditoren, ref: MatDialogRef<AddEditKreditorenComponent>): Observable<any> {

    if(kreditor.id === null) {
      const kreditors = this.kreditoren.getValue();
      const item = kreditors.find((tmp) => tmp.kreditorennummer === kreditor.kreditorennummer);
      if(item !== undefined) {
        this.snck.open('Es gib schön kreditor mit solche nr... Abrrechen', 'Ok', {duration: 3000})
        return of(item);
      }

      return this.http.post<iKreditoren>(this.API, kreditor).pipe(
        map((res) => {
          if(res.id){

            kreditors.push(res);
            this.kreditoren.next(kreditors);
            ref.close(res);
            return res;
          }

          const err = new Error();
          Object.assign(err, res);
          this.snck.open(err.message, 'Ok', {duration: 3000})
          return res;
        }
        )
      )

    } else {
      return this.http.patch<number>(this.API+`/${kreditor.id}`, kreditor).pipe(
        map((res) => {
          if(res === 1){
            const kreditors = this.kreditoren.getValue();
            for(let i = 0; i < kreditors.length; i++) {
              if(kreditors[i].id === kreditor.id) {
                kreditors[i] = kreditor;
              }
            }
            this.kreditoren.next(kreditors);
            ref.close(res);
            return res;
          }

          const err = new Error();
          Object.assign(err, res);
          this.snck.open(err.message, 'Ok', {duration: 3000})
          return res;
        }
        )
      )
    }


  }
/*
* Diese Funktion löscht einen Kreditor aus der Liste der Kreditoren über die API.
* Wenn das Löschen erfolgreich war, wird der Kreditor aus der Liste entfernt.
* Wenn das Löschen nicht erfolgreich war, wird eine Fehlermeldung angezeigt.
*/
  deleteKreditor(itemid: number) {
    return this.http.delete(this.API + '/'+itemid).pipe(map((res) => {
      if(res === 1) {
        const kred = this.kreditoren.getValue();
        const kreds = kred.filter((item) => item.id !== itemid);
        this.kreditoren.next(kreds);
        return res;
      }
      const err = new Error();
      Object.assign(err, res);
      this.snck.open(err.message, 'Ok', {duration: 3000})
      return res;
    }))
  }
}
