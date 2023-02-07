import { Injectable } from '@angular/core';
import { HttpService } from '../../common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../../common/http/base-response.model';
import { RequestPayload } from '../../common/http/request-payload.model';
import { DataEpaymentRequestPayload } from './data-ePayment-request-payload';

@Injectable({
  providedIn: 'root'
})

export class DataEpaymentService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'data-ePayment';
  }

  public selectMasterData(requestPayload?: DataEpaymentRequestPayload, isSpinner?: boolean): Observable<any[]> {
    requestPayload = !requestPayload ? new DataEpaymentRequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any[]>(`${this.url}`,
      { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
      .pipe(map(r => r.body));
  }

  public countMasterData(body: DataEpaymentRequestPayload, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(`${this.url}/count`,
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  public createDraft(body: any, isSpinner?: boolean, params?: any): Observable<any> {
    const request = this.httpClient.put<boolean>(`${this.url}/create-draft`,
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) });
    return this.intercept(request, isSpinner).pipe(map(r => r.body));
  }

  public SelectByIdTicketEpayment(requestPayload?: DataEpaymentRequestPayload, isSpinner?: boolean): Observable<any[]> {
    requestPayload = !requestPayload ? new DataEpaymentRequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any[]>(`${this.url}/ticket-data`,
      { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
      .pipe(map(r => r.body));
  }


}
