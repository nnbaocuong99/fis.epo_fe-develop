import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PurchasePlanItemDto } from './purchase-plan-item.model';
import { PurchasePlanItemRequestPayload } from './purchase-plan-item.request-payload';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestPayload } from '../../common/http/request-payload.model';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';

@Injectable({
    providedIn: 'root'
})

export class PurchasePlanItemService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'purchase-plan-item';
    }

    public import(files: File[], requestPayload: PurchasePlanItemRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new PurchasePlanItemRequestPayload() : requestPayload;
        const formData = new FormData();
        const response = this.httpClient.post<boolean>(
            `${this.url}/import`,   // URL
            formData,               // Form data
            {
                observe: 'response',
                headers: new HttpHeaders({ 'id-token': this.getCookie('id-token') }),
                params: requestPayload.toParams()
            }); // Option

        for (const file of files) {
            formData.append('files', file, file.name);
        }

        return this.intercept(response, isShowLoading).pipe(map(r => r.body));
    }

    public selectTotalBom(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/total-bom',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public checkIndexNoExists(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/check-index-no-exist',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public updateQuantityAndStatus(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.put<any>(`${this.url}/update-quantity-and-status`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }
}
