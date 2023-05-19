import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, combineLatest, map, of, tap } from 'rxjs';
import { IUser } from '../model/iUser';
import { environments } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';
/**
 * The UserService class provides methods to interact with the API for managing users.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = environments.API_URL + 'user';

  /**
   * Constructs a new instance of the UserService class.
   * @param http The HttpClient used to make API requests.
   * @param snack The MatSnackBar used to display notifications.
   */
  constructor(private readonly http: HttpClient, private snack: MatSnackBar) { }

  /**
   * Creates a new user.
   * @param user The user to create.
   * @returns An observable that emits the created user.
   */
  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.API_URL}`, user);
  }

  /**
   * Retrieves a user by their ID.
   * @param id The ID of the user to retrieve.
   * @returns An observable that emits the retrieved user.
   */
  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.API_URL}/${id}`).pipe(map((res) => {
      return res;
    }));
  }

  /**
   * Updates a user.
   * @param id The ID of the user to update.
   * @param user The updated user data.
   * @returns An observable that emits the updated user.
   */
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

  /**
   * Deletes a user.
   * @param id The ID of the user to delete.
   * @returns An observable that emits the ID of the deleted user.
   */
  deleteUser(id: number): Observable<number> {
    return this.http.delete<number>(`${this.API_URL}/${id}`);
  }

  /**
   * Changes a user's password.
   * @param pass An object containing the user's ID and the new password.
   * @returns An observable that emits the ID of the user whose password was changed.
   */
  changePassword(pass: { id: number; password: string, altpass: string }, dialogRef: MatDialogRef<ChangePasswordComponent>): Observable<number> {
    console.log(pass)
    return this.http.patch<number>(`${this.API_URL}/changepassword`, pass).pipe(
      tap((res) => {
        if(res !== 1) {
          let err : Error = new Error();
          Object.assign(err, res);
          this.snack.open(err.message, 'Ok', { duration: 3000 })
          return;
        }

        this.snack.open('Password wurde gespeichert', 'Ok', { duration: 1000} )
        dialogRef.close();
      })
    );
  }
}
