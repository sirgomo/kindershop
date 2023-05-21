import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, last, map, of, retry, take, takeLast } from 'rxjs';
import { environments } from 'src/environments/environment';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { Buffer } from 'buffer';
import { Route, Router } from '@angular/router';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   api = environments.API_URL;

   private isLogedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
   isloged$ = this.isLogedSubject.asObservable();
   private userRole: BehaviorSubject<string> = new BehaviorSubject('');
   role$ = this.userRole.asObservable();
   token = '';

  constructor(private httpClient: HttpClient, private snack: MatSnackBar, private route : Router, private location : Router) {}

  login(data : {email : string, password: string}, dilRef: MatDialogRef<LoginComponent>, url: string) {
    console.log(url)
   return this.httpClient.post(this.api + 'auth/login', data).pipe(map((res) => {
    if(Object(res).message !== undefined) {
      this.snack.open(Object(res).message, 'Ok', {duration: 2000});
      return '';
    }

    dilRef.close();
    this.isLogedSubject.next(true);
    this.token = Object(res).access_token;
    this.setRole();
    this.location.navigateByUrl(url);
    return '';
   }), take(1))
  }
  regiseter(ob: any, dilRef: MatDialogRef<RegisterComponent>) {
    return this.httpClient.post(this.api+'auth/new', ob).pipe((map(res => {

      if(Object(res).message !== undefined) {
        this.snack.open(Object(res).message, 'Ok', {duration: 2000});
        return '';
      }
      this.token = Object(res).access_token;
      this.isLogedSubject.next(true);
      dilRef.close();
      return '';
    }, take(1))))
  }
  logout() {
    this.token = '';
    this.isLogedSubject.next(false);
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userid');
    localStorage.removeItem('token');
    this.userRole.next('');
    this.route.navigateByUrl('/');
  }
  private setRole() {
    if (this.token.length > 10) {
      const base64Url = this.token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decoded = JSON.parse(Buffer.from(base64, 'base64').toString());
      localStorage.setItem('token', this.token);
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('email', decoded.email);
      localStorage.setItem('userid', decoded.sub);
      this.userRole.next(decoded.role);
    }
  }
  getIsLogged(){
    if(localStorage.getItem('token') !== null) {
      this.isLogedSubject.next(true);
    }
    return this.isloged$.pipe(map((val) => {
      return val;
    }));
  }
  getIsTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (token !== null ) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decoded = JSON.parse(Buffer.from(base64, 'base64').toString());
     return decoded.exp > Math.floor(Date.now() / 1000) ? false : true;
    }
    return true;
  }
}
