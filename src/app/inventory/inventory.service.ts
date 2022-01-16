import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  public url = `${environment.baseUrl}`;
  constructor( private http: HttpClient ) { }

  getOrnamentsByStatus(status){
    return this.http.get<any>(this.url+`ornaments?status=${status}`);
  }
  createOrn(body){
    return this.http.post<any>(this.url+`ornaments`, body, {})
  }

  getMaterials(){
    return this.http.get<any>(this.url + `hsns`);
  }

  updateMaterial(id, obj){
    return this.http.put<any>(this.url + `hsns/${id}`, obj, {});
  }
}
