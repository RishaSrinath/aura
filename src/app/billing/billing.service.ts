import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  public url = `${environment.baseUrl}`;
  constructor( private http: HttpClient ) { }

  generateInvoice(body){
    return this.http.post<any>(this.url+'invoices/new', { ...body}, {});
  }

  getInvoices(){
    return this.http.get<any>(this.url+'invoices');
  }

  

}
