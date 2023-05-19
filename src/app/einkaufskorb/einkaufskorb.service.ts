import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { iArtikel } from '../model/iArtikel';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environment';
import { iKorbItem } from '../model/iKorbItem';


@Injectable({
  providedIn: 'root'
})
export class EinkaufskorbService {
  private API = environments.API_URL;
  private artInKorb: BehaviorSubject<iKorbItem[]> = new BehaviorSubject<iKorbItem[]>([]);
  artikelsInKorb$ = this.artInKorb.asObservable();
  constructor(private http: HttpClient) { }

  addArtikelToKorb(item : iArtikel) {
    if(localStorage.getItem('korb') === null && item.id !== undefined) {
      const items: iKorbItem[] = [{id : item.id, name: item.name, preis: item.price, große: item.dimensions }];
      localStorage.setItem('korb', JSON.stringify(items));
     return this.artInKorb.next(items);
    }

    const json: iKorbItem[] = JSON.parse(localStorage.getItem('korb')!);
    if (item.id !== undefined) {
      const items = [...json, {id : item.id, name: item.name, preis: item.price, große: item.dimensions }];
      localStorage.setItem('korb', JSON.stringify(items));
      this.artInKorb.next(items);
    }

  }
  removeArtieklFromKorb(artId: number) {
    return this.artikelsInKorb$ = this.artikelsInKorb$.pipe(
      map((artitkels) => {
        const arts = artitkels.filter((item) => item.id !== artId);
        return arts;
      })
    )
  }
  clearKorb() {
    localStorage.removeItem('korb');
    this.artInKorb.next([]);
  }
  loadItems() {
    if(localStorage.getItem('korb') !== null) {
      const items: iKorbItem[] = JSON.parse(localStorage.getItem('korb')!);
      this.artInKorb.next(items);
    }

  }
}
