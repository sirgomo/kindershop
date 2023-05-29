import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, shareReplay, switchMap } from 'rxjs';
import { iBuchung } from 'src/app/model/iBuchung';
import { environments } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarenbuchungService {
  buch: BehaviorSubject<iBuchung[]> = new BehaviorSubject<iBuchung[]>([]);
  buchungs$ = this.buch.asObservable().pipe(
    map((res) => {
      if(res.length === 0)
        this.getAllBuchungen();


        return res;
    })
  );
   API = environments.API_URL + 'warenbuchung';
  constructor(private readonly httpClient: HttpClient) { }

  async getAllBuchungen(): Promise<Observable<iBuchung[]>> {
    return await this.httpClient.get<iBuchung[]>(this.API).pipe(map(res => {
      this.buch.next(res);
      return res;
    }));
  }
  async getBuchungBeiId(id: number): Promise<Observable<iBuchung>> {
    return await this.httpClient.get<iBuchung>(this.API + '/' + id ).pipe(map(res => res));
  }
  async createBuchung(buchung: iBuchung): Promise<Observable<iBuchung>> {
    return await this.httpClient.post<iBuchung>(this.API, buchung).pipe(map((res) => {
      const buchungen = this.buch.getValue();
      this.buch.next([...buchungen, res]);
      return res;
    }));
  }
  async editBuchung(buchung: iBuchung):Promise<Observable<iBuchung>> {
      return await this.httpClient.patch<number>(this.API, buchung).pipe(
        switchMap((res) => {
          const buchungen = this.buch.getValue();
          const index = buchungen.findIndex((item) => item.buchung_id === buchung.buchung_id);
          buchungen[index] = buchung;
          this.buch.next(buchungen);
          console.log('edytowanych ' + res);

          return of(buchung);
        })
      )
  }
}
