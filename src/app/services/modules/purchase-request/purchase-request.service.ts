import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PurchaseRequestDto } from './purchase-request.model';
import { Observable } from 'rxjs';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
    providedIn: 'root'
})

export class PurchaseRequestService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'purchase-request';
    }

    public countItemsGroupByStatus(requestPayload?: PurchaseRequestDto, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new PurchaseRequestDto() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-items-group-by-status',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getPurchaseRequestByClassifyStatus(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new PurchaseRequestDto() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/get-purchase-request-by-classify-status',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countPurchaseRequestByClassifyStatus(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<number> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<number>(this.url + '/count-purchase-request-by-classify-status',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectAppendix(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/select-appendix',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public checkIndexNoExists(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/check-index-no-exist',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countItemsGroupByClassifyType(requestPayload?: PurchaseRequestDto, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new PurchaseRequestDto() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-items-group-by-classify-type',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public assign(body: any, isSpinner?: boolean): Observable<any> {
        const request = this.httpClient.post<boolean>(`${this.url}/assign`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
        return this.intercept(request, isSpinner).pipe(map(r => r.body));
    }
}
