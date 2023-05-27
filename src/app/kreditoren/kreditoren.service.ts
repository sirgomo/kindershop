import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, concat, concatMap, map, merge, scan, startWith, switchMap, tap } from 'rxjs';
import { environments } from 'src/environments/environment';
import { iKreditoren } from 'src/app/model/iKreditoren'

@Injectable({
  providedIn: 'root'
})
export class KreditorenService {
  kreditoren: BehaviorSubject<iKreditoren[]> = new BehaviorSubject<iKreditoren[]>([]);
  kreditoren$ = this.kreditoren.asObservable();
  API = environments.API_URL + 'kreditoren'
  constructor(private readonly http: HttpClient) { }

  getKreditors(): Observable<iKreditoren[]> {
    return this.http.get<iKreditoren[]>(this.API).pipe(map((res) => {
      this.kreditoren.next(res);
      return res;
    }))
  }
  createKreditor(kreditor : iKreditoren): Observable<iKreditoren[]> {
    return this.kreditoren$ = concat(
      this.http.post<iKreditoren[]>(this.API
        , kreditor),
        this.kreditoren$
    ).pipe(
      map(res => res)
    )


  }
}
