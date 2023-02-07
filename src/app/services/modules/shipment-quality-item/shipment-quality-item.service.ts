import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { ShipmentQualityItemServiceDto } from './shipment-quality-item.model';
import { ShipmentQualityItemServiceRequestPayload } from './shipment-quality-item.request-payload';

@Injectable({
    providedIn: 'root'
})

export class ShipmentQualityItemService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'shipment-quality-item';
    }

    public selectPurchaseOderItem(requestPayload?: ShipmentQualityItemServiceDto, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new ShipmentQualityItemServiceDto() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/select-po-item',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countSelectPurchaseOderItem(requestPayload?: ShipmentQualityItemServiceDto, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new ShipmentQualityItemServiceDto() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/count-po-item',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectPoItemId(requestPayload?: ShipmentQualityItemServiceDto, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new ShipmentQualityItemServiceDto() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/select-po-item-id',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

}
