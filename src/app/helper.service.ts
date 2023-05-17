import { Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private appCompo!: AppComponent;
  private artInCategory: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private artProSite: BehaviorSubject<number> = new BehaviorSubject<number>(20);
  private searchItems: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private siteNumber: BehaviorSubject<number> = new BehaviorSubject<number>(1);
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
}
