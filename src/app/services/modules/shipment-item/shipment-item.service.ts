import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';
import { ShipmentItemRequestPayload } from './shipment-item.request-payload';

@Injectable({
    providedIn: 'root',
})
export class ShipmentItemService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'shipment-item';
    }

    public selectFollowPr(body: RequestPayload, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/follow-pr`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public exportAll(requestPayload: ShipmentItemRequestPayload): Observable<void> {
        return this.exportFile('/export-all', requestPayload, 'Lô hàng (Danh sách hàng hóa) ', true);
    }
}
