import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';
import { RequestPayload } from '../../common/http/request-payload.model';
import { PurchaseOrderDto } from './purchase-order.model';
import { PurchaseOrderRequestPayload } from './purchase-order.request-payload';

@Injectable({
    providedIn: 'root',
})
export class PurchaseOrderService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'purchase-order';
    }

    public countItemsGroupByStatus(requestPayload?: PurchaseOrderDto, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new PurchaseOrderDto() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-items-group-by-status',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countItemsGroupByStatusPost(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/count-items-group-by-status-post`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectForInvoice(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/for-invoice',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countForInvoice(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-for-invoice',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectForShipment(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/for-shipment',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countForShipment(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-for-shipment',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public save(body: any, isSpinner?: boolean): Observable<any> {
        const request = this.httpClient.post<boolean>(`${this.url}/save`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
        return this.intercept(request, isSpinner).pipe(map(r => r.body));
    }

    public saveDraft(body: any, isSpinner?: boolean): Observable<any> {
        const request = this.httpClient.post<boolean>(`${this.url}/save-draft`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
        return this.intercept(request, isSpinner).pipe(map(r => r.body));
    }

    public checkCodeExist(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/check-code-exist',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public checkInvalidOrgApply(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/check-invalid-orgApply',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public rateVendor(body: any, isSpinner?: boolean): Observable<any> {
        const request = this.httpClient.post<boolean>(`${this.url}/rate-vendor`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
        // request.subscribe(res => res =)
        return this.intercept(request, isSpinner).pipe(map(r => r.body));
    }

    public selectPost(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/select-post`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countPost(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/count-post`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public exportAll(requestPayload: RequestPayload, poCode?: string): Observable<void> {
        return this.exportFile('/export-all', requestPayload, 'Export PO : ' + poCode, true);
    }

    public exportContract(requestPayload?: RequestPayload, poCode?: string): Observable<any> {
        return this.exportFile('/export-contract', requestPayload, 'Hợp đồng ' + poCode, true, '.docx');
    }
}
