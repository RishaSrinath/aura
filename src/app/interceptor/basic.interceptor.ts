import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.includes('auth/local')){
      return next.handle(request);
    }
    else{
      let token = sessionStorage.getItem('token');
      const clonedRequest = request.clone({ headers: request.headers.append('Authorization', `Bearer ${token}`) });

      // Pass the cloned request instead of the original request to the next handle
      return next.handle(clonedRequest);
    }
  }
}
