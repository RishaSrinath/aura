import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public url = `${environment.baseUrl}`;

  constructor( private http: HttpClient ) { }

  public getProfileDetails(){
    let user_dtls = JSON.parse(localStorage.getItem('user'));
    return this.http.get<any>(this.url+`shop-admins?user=${user_dtls.id}`);
  }
}
