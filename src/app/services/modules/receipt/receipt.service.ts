import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'receipt';
  }

  public selectViewData(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/select-view',
      { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner)
      .pipe(map(r => r.body));
  }

  public countViewData(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/count-view',
      { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner)
      .pipe(map(r => r.body));
  }

  public selectReceiptStep2SI(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/receipt-step-2-si',
      { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner)
      .pipe(map(r => r.body));
  }

  public selectReceiptStep2PI(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any[]> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any[]>(this.url + '/receipt-step-2-pi',
      { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner)
      .pipe(map(r => r.body));
  }

  public selectFirstOrDefault(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/first-or-default',
      { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner)
      .pipe(map(r => r.body));
  }

  public deleteByShipmentId(id: string, isSpinner?: boolean): Observable<boolean> {
    return this.intercept(this.httpClient.delete(`${this.url}/delete-by-shipmentId/${id}`,
      { observe: 'response', headers: this.getHeaders() }), isSpinner)
      .pipe(map(r => r.body));
  }

  public deleteByPiId(id: string, isSpinner?: boolean): Observable<boolean> {
    return this.intercept(this.httpClient.delete(`${this.url}/delete-by-piId/${id}`,
      { observe: 'response', headers: this.getHeaders() }), isSpinner)
      .pipe(map(r => r.body));
  }
}
