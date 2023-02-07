import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { PurchaseRequestItemDto } from './purchase-request-item.model';
import { DeleteThenInsertRequestDto, PurchaseRequestItemRequestPayload } from './purchase-request-item.request-payload';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common/http/http.service';
import { BaseResponse } from '../../common/http/base-response.model';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
    providedIn: 'root'
})

export class PurchaseRequestItemService extends HttpService<any> {
    constructor() {
        super();
        this.url = this.origin + 'purchase-request-item';
    }

    import(files: File[], requestPayload: PurchaseRequestItemRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new PurchaseRequestItemRequestPayload() : requestPayload;
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

    public exportAll(requestPayload: PurchaseRequestItemRequestPayload): Observable<void> {
        return this.exportFile('/export-all', requestPayload, 'Yêu cầu mua hàng (Danh sách hàng hóa) ', true);
    }

    public bulkMerge(body: BaseResponse[], isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.put<any>(`${this.url}/bulk-merge`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public deleteAllAndInsertByPrId(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/delete-all-and-insert-by-prId`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public deleteThenInsert(body: DeleteThenInsertRequestDto, isSpinner?: boolean): Observable<boolean> {
        const request = this.httpClient.post<boolean>(`${this.url}/delete-then-insert`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
        // request.subscribe(res => res =)
        return this.intercept(request, isSpinner).pipe(map(r => r.body));
    }

    public selectTotalBom(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/total-bom',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public checkIpoNumberExist(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/check-ipo-number-exist',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
