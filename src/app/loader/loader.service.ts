import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isloading$ = this.loader.asObservable();

  //showLoaderUntilCompleted<T>(obs$ : Observable<T>): Observable<T> {
  //  return of<any>(false);
  //}
  setLoaderOn() {
    console.log('loader');
    this.loader.next(true);
  }
  setLoaderOff() {
    this.loader.next(false);
  }
}
