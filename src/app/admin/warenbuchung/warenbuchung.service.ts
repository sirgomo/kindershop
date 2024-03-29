import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { iBuchung } from 'src/app/model/iBuchung';
import { iBuchungArtikel } from 'src/app/model/iBuchungArtikel';
import { environments } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarenbuchungService {
  buch: BehaviorSubject<iBuchung[]> = new BehaviorSubject<iBuchung[]>([]);
  buchungs$ = this.buch.asObservable().pipe(
    map((res) => {
      if(res.length === 0)
       return this.getAllBuchungen();

        return res;
    }));
   API = environments.API_URL + 'warenbuchung';
  constructor(private readonly httpClient: HttpClient) { }

  getAllBuchungen(): Observable<iBuchung[]> {
    return this.httpClient.get<iBuchung[]>(this.API).pipe(map(res => {
      this.buch.next(res);
      return res;
    }));
  }
   getBuchungBeiId(id: number): Observable<iBuchung> {
    return this.httpClient.get<iBuchung>(this.API + '/' + id ).pipe(map(res => res));
  }
  createBuchung(buchung: iBuchung): Observable<iBuchung> {
    return this.httpClient.post<iBuchung>(this.API, buchung).pipe(map((res) => {
      const buchungen = this.buch.getValue();
      this.buch.next([...buchungen, res]);
      return res;
    }));
  }
  editBuchung(buchung: iBuchung): Observable<iBuchung> {
      return this.httpClient.patch<iBuchung>(this.API, buchung).pipe(
        map((res) => {
          const buchungen = this.buch.getValue();
          const index = buchungen.findIndex((item) => item.buchung_id === buchung.buchung_id);
          const item : iBuchung = {
            ...buchungen[index],
            ...res
          }
          const newBuch: iBuchung[] = buchungen.slice(0);
          newBuch[index] = item;
          this.buch.next(newBuch);
          return res;
        })
      )
  }
  addArtikel(artikel: iBuchungArtikel): Observable<iBuchungArtikel> {
    return this.httpClient.post<iBuchungArtikel>(this.API+'/art', artikel).pipe(
      map((res) => {
        return res;
      })
    )
  }
  deleteArtikelFromBuchung(artid: number, buchungsid: number) {
    return this.httpClient.delete(this.API+`/${artid}/${buchungsid}`).pipe(
      map(res => res)
    )
  }
}
