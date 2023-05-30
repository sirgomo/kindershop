import { Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import { BehaviorSubject, of } from 'rxjs';
import { iArtikel } from './model/iArtikel';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private appCompo!: AppComponent;
  private artInCategory: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private artProSite: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  private searchItems: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  private siteNumber: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private liferantid: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  liferantid$ = this.liferantid.asObservable();
  siteNumber$ = this.siteNumber.asObservable();
  searchItem$ = this.searchItems.asObservable();
  artProSite$ = this.artProSite.asObservable();
  artikelInCategory$ = this.artInCategory.asObservable();
  constructor() { }

  setAppComponenet(app: AppComponent) {
    this.appCompo = app;
  }
  getAppComponent(){
    return this.appCompo;
  }
  setCategory(catId : number) {
    this.artInCategory.next(catId);
  }
  setItemMengeProSite(menge: number) {
    this.artProSite.next(menge);
  }
  searchItem(item: string) {
    this.searchItems.next(item);
  }
  setSiteNumber(sitenr: number) {
    this.siteNumber.next(sitenr);
  }
  getMengeProSite() {
    return this.artProSite.getValue();
  }
  setLiferant(liferantid: number) {
    this.liferantid.next(liferantid);
  }
}
