import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { environments } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  app!: AppComponent;
   api = environments.API_URL;
   private tokenSubject : BehaviorSubject<string> = new BehaviorSubject('');
   token$ = this.tokenSubject.asObservable();

  constructor(private httpClient: HttpClient, private snack: MatSnackBar) {}

  login(data : {email : '', password: ''}, dilRef: MatDialogRef<LoginComponent>) {
    this.httpClient.post(this.api + 'auth', data).subscribe()
  }
  logout() {}
  setAppComponet(app: AppComponent) {
    this.app = app;
  }
}
