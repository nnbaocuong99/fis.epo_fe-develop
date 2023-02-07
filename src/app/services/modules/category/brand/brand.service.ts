import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestPayload } from '../../../common/http/request-payload.model';
import { BrandRequestPayload } from './brand.request.payload';
import { HttpHeaders } from '@angular/common/http';
import { BaseResponse } from '../../../common/http/base-response.model';
@Injectable({
    providedIn: 'root'
})

export class BrandService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'brand';
    }

    public save(body: any, isSpinner?: boolean): Observable<any> {
        const request = this.httpClient.post<boolean>(`${this.url}/save`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
        return this.intercept(request, isSpinner).pipe(map(r => r.body));
    }

    public checkCodeExist(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/check-code-exist',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public import(files: File[], requestPayload: BrandRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new BrandRequestPayload() : requestPayload;
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

    public selectBrandYear(body: BrandRequestPayload, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/select-post`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countBrandYear(body: BrandRequestPayload, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/count-post`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public exportAll(requestPayload: RequestPayload): Observable<void> {
        return this.exportFile('/export-all', requestPayload, 'Content-BP-Vendor-Export', true);
    }

    public exportMarketingFund(requestPayload: RequestPayload): Observable<void> {
        return this.exportFile('/export-marketing-fund', requestPayload, 'Báo-cáo-MDF', true);
    }

    public cloneData(requestPayload: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/clone-brand',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

}
