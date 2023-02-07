import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { PurchaseAttachmentRequestPayload } from './purchase-attachment.request.payload';

@Injectable({
    providedIn: 'root'
})

export class PurchaseAttachmentService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'purchase-attachment';
    }

    public getPurchaseAttachment(requestPayload: PurchaseAttachmentRequestPayload, isSpinner?: boolean): Observable<any[]> {
        return this.intercept(this.httpClient.get<any[]>(`${this.url}/get_purchase_attachment`,
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
