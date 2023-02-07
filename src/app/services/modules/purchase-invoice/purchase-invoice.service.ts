import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../common';
import { map } from 'rxjs/operators';
import {
    PurchaseInvoiceRequestPayload, PurchaseInvoiceRequestSaveDto, PurchaseInvoiceRequestSaveTaxDto
} from './purchase-invoice.request-payload';
import { RequestPayload } from '../../common/http/request-payload.model';
import { BaseResponse } from '../../common/http/base-response.model';

@Injectable({
    providedIn: 'root'
})

export class PurchaseInvoiceService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'purchase-invoice';
    }

    import(files: File[], requestPayload: PurchaseInvoiceRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new PurchaseInvoiceRequestPayload() : requestPayload;
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

    public selectWithoutShipment(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/select-without-shipment',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countWithoutShipment(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-without-shipment',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public exportAll(requestPayload: PurchaseInvoiceRequestPayload): Observable<void> {
        return this.exportFile('/export-all', requestPayload, 'p-invoice', true);
    }

    public save(body: PurchaseInvoiceRequestSaveDto, isSpinner?: boolean): Observable<any> {
        const request = this.httpClient.post<boolean>(`${this.url}/save`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
        // request.subscribe(res => res =)
        return this.intercept(request, isSpinner).pipe(map(r => r.body));
    }

    public saveDraft(body: PurchaseInvoiceRequestSaveDto, isSpinner?: boolean): Observable<any> {
        const request = this.httpClient.post<boolean>(`${this.url}/save-draft`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
        // request.subscribe(res => res =)
        return this.intercept(request, isSpinner).pipe(map(r => r.body));
    }

    public checkInvoiceExist(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/check-invoice-exist',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public UpdateContractorTax(body: PurchaseInvoiceRequestSaveTaxDto, isSpinner?: boolean): Observable<any> {
        const request = this.httpClient.post<boolean>(`${this.url}/update-contractor-tax`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
        // request.subscribe(res => res =)
        return this.intercept(request, isSpinner).pipe(map(r => r.body));
    }

    public selectWithMapPi(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any[]> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any[]>(this.url + '/select-with-map-pi',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countWithMapPi(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<number> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<number>(this.url + '/count-with-map-pi',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public suggestionImport(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + `/suggestion-import`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public update(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/update`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public requestImportGoods(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/request-import-goods`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public afCacuationTax(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/af-cacuation-tax`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
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

    public selectWithoutPaymentOrder(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/select-without-payment-order',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countWithoutPaymentOrder(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-without-payment-order',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
