import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';
import { ShipmentItemDto } from '../shipment-item/shipment-item.model';
import { ImportGoodsInvoiceRequestPayload } from './import-goods-invoice-request-payload';
import { ImportGoodsRequestPayload } from './import-goods-request-payload';
import { ImportGoodsDto } from './import-goods.model';

@Injectable({
    providedIn: 'root'
})

export class ImportGoodsService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'import-goods';
    }
    public countItemsGroupByStatus(requestPayload?: ImportGoodsDto, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new ImportGoodsDto() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-items-group-by-status',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public saveDraftImportShipment(id: string, body: ShipmentItemDto[], isSpinner?: boolean): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/save-draft-import-shipment/${id}`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public saveDraftImportInvoice(id: string, body: ImportGoodsInvoiceRequestPayload, isSpinner?: boolean): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/save-draft-import-invoice/${id}`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getListSyncElimStatus(requestPayload?: ImportGoodsRequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new ImportGoodsRequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/get-list-sync-elim-status',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countListSyncElimStatus(requestPayload?: ImportGoodsRequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new ImportGoodsRequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-list-sync-elim-status',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getEliminationInfoViewInvoice(shipmentId: string, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.get<any>(this.url + '/get_elimination_info_view_invoice/' + shipmentId,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectPost(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/select`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countPost(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/count`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }
}
