import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  public url = `${environment.baseUrl}`;

  constructor( private http: HttpClient ) {

  }

  public getOrnaments(){
    return this.http.get<any>(this.url+`ornaments?status=0`);
  }

  getMaterials(){
    return this.http.get<any>(this.url+`hsns`);
  }

}
