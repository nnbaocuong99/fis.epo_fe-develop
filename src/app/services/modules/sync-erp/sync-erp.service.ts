import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root',
})
export class SyncErpService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'sync-erp';
  }

  // đồng bộ receipt bước 1 của lô hàng sang ERP
  public syncReceiptStep1Shipment(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/sync-receipt-step-1-shipment',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // đồng bộ receipt bước 2 của lô hàng sang ERP
  public syncReceiptStep2Shipment(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any[]>(this.url + `/sync-receipt-step-2-shipment`,
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // đồng bộ receipt bước 2 của hóa đơn sang ERP (hóa đơn chỉ đẩy receipt 1 lần tính là bước 2 luôn)
  public syncReceiptStep2Invoice(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/sync-receipt-step-2-invoice',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // đồng bộ hóa đơn sang AP ERP
  public syncPi(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/sync-pi',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // đồng bộ update cost
  public syncUpdateCost(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/sync-update-cost',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // check status bên erp để update cost
  public checkAllowUpdateCost(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/check-allow-update-cost',
      { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
      .pipe(map(r => r.body));
  }

  // check status bên erp để đẩy receipt b2 lô hàng
  public checkAllowReceiptB2Shipment(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/check-allow-receipt-b2-shipment',
      { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
      .pipe(map(r => r.body));
  }

  // check có cho đẩy receipt hay không, cập nhật status lại nếu cần
  public checkAllowReceipt(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/check-allow-receipt',
      { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
      .pipe(map(r => r.body));
  }

  // return AP ERP
  public returnPi(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/return-pi',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // return receipt
  public returnReceipt(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/return-receipt',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // return update cost
  public returnUpdateCost(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/return-update-cost',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // view log update cost
  public viewLogPi(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/view-log-pi',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // view log receipt
  public viewLogReceipt(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/view-log-receipt',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

  // view log update cost
  public viewLogUpdateCost(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(this.url + '/view-log-update-cost',
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }

}
