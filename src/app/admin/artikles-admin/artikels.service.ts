import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iArtikel } from 'src/app/model/iArtikel';
import { environments } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtikelsService {

  private API = environments.API_URL + 'artikel';
  artikels$ = new Observable<any>();
  constructor(private http: HttpClient) { }

  getAllArtikel(): Observable<iArtikel[]> {
    return this.http.get<iArtikel[]>(this.API);
  }

  getArtikelById(id: number): Observable<iArtikel> {
    return this.http.get<iArtikel>(`${this.API}/${id}`);
  }

  createArtikel(artikel: iArtikel): Observable<iArtikel> {
    return this.http.post<iArtikel>(this.API, artikel);
  }

  updateArtikel(id: number, artikel: iArtikel): Observable<iArtikel> {
    return this.http.put<iArtikel>(`${this.API}/${id}`, artikel);
  }

  deleteArtikel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
