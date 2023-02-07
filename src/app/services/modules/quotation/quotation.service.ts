import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class QuotationService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'quotation';
  }

  public save(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(`${this.url}/save`,
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  public invitation(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(`${this.url}/invitation`,
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

}
