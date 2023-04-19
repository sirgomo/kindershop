import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, combineLatest, map, of } from 'rxjs';
import { IUser } from '../model/iuser';
import { environments } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = environments.API_URL + 'user';

  constructor(private readonly http: HttpClient, private snack: MatSnackBar) { }

  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.API_URL}`, user);
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.API_URL}/${id}`).pipe(map((res) => {
      return res;
    }));
  }

  updateUser(id: number, user: IUser): Observable<IUser> {
    return combineLatest([of(user), this.http.put<number>(`${this.API_URL}/${id}`, user).pipe(map((res) => res)) ]).pipe(map(([user, res]) => {
      if(res !== 1) {
        this.snack.open('Etwas ist schiefgegangengen, die änderung wurde nicht gespeichert', 'Ok', {duration: 2000});
        return user;
      }
        this.snack.open('Ok, gespeichert', '', {duration: 1000});
      return user;
    }))

  }


  deleteUser(id: number): Observable<number> {
    return this.http.delete<number>(`${this.API_URL}/${id}`);
  }

  changePassword(pass: { id: number; password: string }): Observable<number> {
    return this.http.patch<number>(`${this.API_URL}/changepassword`, pass);
  }

}
