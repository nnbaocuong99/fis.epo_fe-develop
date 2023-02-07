import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';
import { RequestPayload } from '../../common/http/request-payload.model';
import { PurchaseInvoiceItemRequestPayload } from './purchase-invoice-item.request-payload';

@Injectable({
    providedIn: 'root',
})
export class PurchaseInvoiceItemService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'purchase-invoice-item';
    }

    public checkExists(body: RequestPayload, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/check-exists`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectWithoutShipment(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/select-without-shipment',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public requestUpdateOrgCode(body: any, isSpinner?: boolean, params?: any): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/request-update-org-code`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    import(files: File[], requestPayload: PurchaseInvoiceItemRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new PurchaseInvoiceItemRequestPayload() : requestPayload;
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

    public selectFollowPr(body: RequestPayload, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/follow-pr`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public exportContractorTax(requestPayload: PurchaseInvoiceItemRequestPayload, exportFileName: string): Observable<void> {
        return this.exportFile('/export-contractor-tax', requestPayload, exportFileName, true);
    }
}
