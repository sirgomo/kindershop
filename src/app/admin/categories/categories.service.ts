import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, combineLatest, concatMap, finalize, map, merge, of, scan, shareReplay, switchMap, take, takeLast, tap } from 'rxjs';
import { environments } from 'src/environments/environment';
import { AddCategoryComponent } from './add-category/add-category.component';
import { iCategory } from 'src/app/model/icategory';
import { LoaderService } from 'src/app/loader/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';


/**
 * Service for managing categories
 */
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  // Subject to hold the categories
  private cat : BehaviorSubject<iCategory[]> = new BehaviorSubject<iCategory[]>([]);
  // Observable to subscribe to changes in categories
  category$ = this.cat.asObservable();
  // API endpoint for categories
  API = environments.API_URL+ 'category';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Function to retrieve all categories
   * @returns Observable<iCategory[]>
   */
  findAll(): Observable<iCategory[]> {
    return this.http.get<iCategory[]>(this.API).pipe(map((res) => {
      // If response is empty, return an empty array
      if(res === undefined || res === null) {
        return [];
      }
      // Update the subject with the retrieved categories
      this.cat.next(res);
      // Return the retrieved categories
      return res;
    }));
  }

  /**
   * Function to add a new category
   * @param category The new category to be added
   * @param dialogRef The dialog reference to close after adding the category
   * @returns Observable<any>
   */
  create(category: iCategory, dialogRef: MatDialogRef<AddCategoryComponent>): Observable<any> {
    return this.http.post<iCategory>(this.API, category).pipe(map((res) => {
      if(res) {
        // Combine the current categories with the new category and update the subject
        this.category$ =  combineLatest([this.category$, of([res])]).pipe(map(([cats, cat]) => {
          return [...cats, ...cat];
        }));
        // Show snackbar message after successful addition of category
        this.snackBar.open('Kategorie erfolgreich hinzugefügt!', '', { duration: 3000 });
      }
      // Close the dialog after adding the category and return the updated categories
      return dialogRef.close(this.category$);
    }));
  }

  /**
   * Function to update a category
   * @param cat The category to be updated
   * @param dialogRef The dialog reference to close after updating the category
   * @returns Observable<any>
   */
  update(cat: iCategory, dialogRef: MatDialogRef<AddCategoryComponent>) {
    return this.http.put(`${this.API}/${cat.id}`, cat).pipe(map(res => {
      if(res === 1) {
        // Filter the updated category from the current categories and update the subject
        this.category$ = this.category$.pipe(map((cats) => {
          cats.filter(item => item.id === cat.id).map(it => it.name = cat.name);
          return cats;
        }));
        // Show snackbar message after successful update of category
        this.snackBar.open('Kategorie erfolgreich aktualisiert!', '', { duration: 3000 });
      }
      // Close the dialog after updating the category and return the updated categories
      return dialogRef.close(this.category$);
    }));
  }

  /**
   * Function to delete a category
   * @param id The id of the category to be deleted
   * @returns Observable<any>
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`).pipe(map((res) => {
      if(res === 1) {
        // Filter the deleted category from the current categories and update the subject
        this.category$ = this.category$.pipe(map(cat => cat.filter((item) => item.id !== id)));
        // Show snackbar message after successful deletion of category
        this.snackBar.open('Kategorie erfolgreich gelöscht!', '', { duration: 3000 });
      }
      // Return the updated categories
      return this.category$;
    }));
  }

}
