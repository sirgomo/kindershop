import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { iArtikel } from '../model/iArtikel';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environment';
import { iKorbItem } from '../model/iKorbItem';
import { IUser } from '../model/iUser';


@Injectable({
  providedIn: 'root'
})
export class EinkaufskorbService {
  private API = environments.API_URL;
  private USER_API = environments.API_URL + 'user';
  private artInKorb: BehaviorSubject<iKorbItem[]> = new BehaviorSubject<iKorbItem[]>([]);
  artikelsInKorb$ = this.artInKorb.asObservable();
  constructor(private http: HttpClient) { }

  addArtikelToKorb(item : iArtikel) {

    if(localStorage.getItem('korb') === null && item.id !== undefined) {
      const items: iKorbItem[] = [{id : item.id, name: item.name, preis: item.price, grosse: item.dimensions, menge: 1 }];
      localStorage.setItem('korb', JSON.stringify(items));
     return this.artInKorb.next(items);
    }

    const json: iKorbItem[] = JSON.parse(localStorage.getItem('korb')!);
    if (item.id !== undefined) {
      let menge = false;
      json.map((element) => {
        if(item.id === element.id) {
          element.menge +=1;
          localStorage.setItem('korb', JSON.stringify(json));
          this.artInKorb.next(json);
          menge = true;
        }
      });

      if(menge) return;

      const items = [...json, {id : item.id, name: item.name, preis: item.price, grosse: item.dimensions, menge: 1}];
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
  deleteItem(itemid : number) {
    const items = localStorage.getItem('korb');
    if(!items) return;

    const tmp: iKorbItem[] = JSON.parse(items);
    const rem = tmp.filter((item) => item.id !== itemid);
    localStorage.setItem('korb', JSON.stringify(rem));
    this.artInKorb.next(rem);

  }
  changeMenge(itemid: number, menge: number) {
    const items: iKorbItem[] = JSON.parse(localStorage.getItem('korb')!);
    let itemLoschen = false;
    items.map((res) => {
        if(res.id === itemid){
              res.menge += menge;

              if  ( res.menge === 0)
              itemLoschen = true;
        }
    });

    if(itemLoschen) {
      const tmp = items.filter((item) => item.id !== itemid);
      localStorage.setItem('korb', JSON.stringify(tmp));
      this.artInKorb.next(tmp);
    } else {
      localStorage.setItem('korb', JSON.stringify(items));
      this.artInKorb.next(items);
    }

  }
  getUserByEmail(email: string): Observable<IUser> {
    return this.http.get<IUser>(this.USER_API + `/${email}`).pipe(map(res => res));
  }
}
