import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, map, tap } from 'rxjs';
import { iArtikel } from '../model/iArtikel';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environment';
import { iKorbItem } from '../model/iKorbItem';
import { IUser } from '../model/iUser';
import { iPaypalRes } from '../model/iPaypalRes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelperService } from '../helper.service';


@Injectable({
  providedIn: 'root'
})
export class EinkaufskorbService {
  private BEST_API = environments.API_URL + 'bestellungen';
  private USER_API = environments.API_URL + 'user';
  private artInKorb: BehaviorSubject<iKorbItem[]> = new BehaviorSubject<iKorbItem[]>([]);
  artikelsInKorb$ = this.artInKorb.asObservable();
  constructor(private http: HttpClient, private readonly snackBar : MatSnackBar, private helper: HelperService) { }

  addArtikelToKorb(item : iArtikel) {

    if(localStorage.getItem('korb') === null && item.id !== undefined) {
      const items: iKorbItem[] = [{id : item.id, name: item.name, preis: item.price, mwst: item.mwst, grosse: item.dimensions, menge: 1 }];
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

      const items = [...json, {id : item.id, name: item.name, preis: item.price, mwst: item.mwst, grosse: item.dimensions, menge: 1}];
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
  getBestelungen(menge: number, sitenr: number) {
    return this.http.get(this.BEST_API +'?menge='+menge+'&sitenr='+sitenr)
    .pipe(map((res) => {
      console.log(res);
      return res;
    }))
  }
  getBestellungBeiEmail(email: string) {
    return this.http.get<iPaypalRes[]>(this.BEST_API + '/email/'+email)
    .pipe(map((res) => {
      console.log(res)
      return res;
    }))
  }
  getBestellungBeiId(id: number) {
    return this.http.get(this.BEST_API + '/'+id)
    .pipe(map((res) => {
      console.log(res);
      return res;
    }))
  }
  checkBestellung(user: IUser, items: iKorbItem[]) {
   return this.http.post<{preis: string, item: iKorbItem[]}>(this.BEST_API, {user: user, items: items})
    .pipe(tap((res) => {
      return res;
    }))
  }
  deleteBestellugn(bestellid: number) {
    return this.http.delete(this.BEST_API + '/'+bestellid)
    .pipe(map((res) => {
      if(res === 1) {
        console.log('ok, deleted');
        return EMPTY;
      }

      let err: Error = new Error();
      Object.assign(err, res);
      console.log(err.message);
      return EMPTY;
    }))
  }
  createBestellugn(bestellung: iPaypalRes) {
    const bes = this.http.post<iPaypalRes>(this.BEST_API+'/new', bestellung).subscribe(res => {
   //   console.log('res ' + JSON.stringify(res) );
      if(res.id === undefined) {
        this.snackBar.open('Etwas ist schiefgelaufen, bestellung wurde nicht gespiechert!', 'Ok', {duration: 5000});
        bes.unsubscribe();
        return;
      }

      const buchungen = this.helper.getBuchungen();
      const curr = [...buchungen, res];
      localStorage.removeItem('korb');
      this.artInKorb.next([]);
    //  console.log(curr)
      this.helper.setBuchungen(curr);
      bes.unsubscribe();
      });
  }
}
