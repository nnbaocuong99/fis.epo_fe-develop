import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';
import { TaxInvoiceRequestPayload } from './tax-invoice.request-payload';

@Injectable({
    providedIn: 'root'
})

export class TaxInvoiceService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'tax-invoice';
    }

    public exportAll(requestPayload: TaxInvoiceRequestPayload): Observable<void> {
        return this.exportFile('/export-all', requestPayload, 'p-tax-invoice', true);
    }

    public import(files: File[], requestPayload: TaxInvoiceRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new TaxInvoiceRequestPayload() : requestPayload;
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

    public bulkMap(body: BaseResponse, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/bulk-map`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }




}
