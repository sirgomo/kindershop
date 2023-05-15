import { Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import { CategoriesService } from './admin/categories/categories.service';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private appCompo!: AppComponent;
  private artInCategory: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  artikelInCategory$ = this.artInCategory.asObservable();
  private catServ!: CategoriesService;
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
}
