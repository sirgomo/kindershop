import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environments } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  API = environments.API_URL;

  constructor(private router: Router, private authServi: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let req = request;
    if( localStorage.getItem('role') === 'user' || localStorage.getItem('role') === 'admin') {
      if(this.authServi.getIsTokenExpired()) {
        this.authServi.logout();
        return next.handle(req);
      }

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return next.handle(req);
      } else if (localStorage.getItem('korb') && req.url === `${this.API}bestellungen`) {
        return next.handle(req);
      }

      else {
        this.router.navigateByUrl('/');
      }
    return next.handle(req);
  }
}
