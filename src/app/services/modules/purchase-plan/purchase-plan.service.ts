import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
    providedIn: 'root'
})

export class PurchasePlanService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'purchase-plan';
    }

    public countByStatus(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-by-status',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public updateQuantityAndStatus(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.put<any>(`${this.url}/update-quantity-and-status`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public uploadedFile(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/uploaded-file`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }
}
