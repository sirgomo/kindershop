import { Injectable } from '@angular/core';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private appCompo!: AppComponent;
  constructor() { }

  setAppComponenet(app: AppComponent) {
    this.appCompo = app;
  }
  getAppComponent(){
    return this.appCompo;
  }
}
