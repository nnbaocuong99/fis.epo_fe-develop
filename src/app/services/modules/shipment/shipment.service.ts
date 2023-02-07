import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';
import { RequestPayload } from '../../common/http/request-payload.model';
import { ShipmentDto } from './shipment.model';
import { ShipmentRequestPayload } from './shipment.request-payload';

@Injectable({
    providedIn: 'root'
})

export class ShipmentService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'shipment';
    }

    public import(files: File[], requestPayload: ShipmentRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new ShipmentRequestPayload() : requestPayload;
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

    public update(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/update`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
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

    public confirmGoodsInStock(body: ShipmentDto, isSpinner?: boolean, params?: any): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/confirm-goods-in-stock`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public checkShipmentExist(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/check-shipment-exist',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public sendMailRequestUpdateTermAccount(body: ShipmentDto, isSpinner?: boolean, params?: any): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/send-mail-request-update-term-account`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public confirmGoodsToTheWarehouse(body: ShipmentDto, isSpinner?: boolean, params?: any): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/confirm-goods-to-the-warehouse`,
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
}
