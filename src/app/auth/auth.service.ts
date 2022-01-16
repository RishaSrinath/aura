import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus: boolean = false;

  public url = `${environment.baseUrl}`;

  constructor( private http: HttpClient) { }

  public setLoggedInStatus(value: boolean) {
    this.loggedInStatus = value;
  }

  public isLoggedIn() {
      return this.loggedInStatus;
  }

  login(identifier: string, password: string): Observable<Object> {
    return this.http.post<any>(this.url+'auth/local', { identifier: identifier, password:password}, {});
  }

  getUserDetails(){
    let user_dtls = JSON.parse(localStorage.getItem('user'));
    return this.http.get<any>(this.url+`shop-admins?user=${user_dtls.id}`);
  }

}
