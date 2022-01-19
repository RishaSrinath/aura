import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public url = `${environment.baseUrl}`;
  constructor( private http: HttpClient ) { }

  getInvoicesforDate(from, to){
    return this.http.get<any>(this.url + `invoices?date_gte=${from}&date_lt=${to}`);
  }

  getOrnamentsByStatus(status){
    return this.http.get<any>(this.url+`ornaments?status=${status}`);
  }

}
