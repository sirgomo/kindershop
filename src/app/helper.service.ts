import { Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import { CategoriesService } from './admin/categories/categories.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private appCompo!: AppComponent;
  private catServ!: CategoriesService;
  constructor() { }

  setAppComponenet(app: AppComponent) {
    this.appCompo = app;
  }
  getAppComponent(){
    return this.appCompo;
  }

}
