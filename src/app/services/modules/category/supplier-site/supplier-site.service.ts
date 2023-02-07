import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../common';
import { RequestPayload } from '../../../common/http/request-payload.model';

@Injectable({
    providedIn: 'root'
})

export class SupplierSiteService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'supplier-site';
    }

    public selectDistinctCode(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/distinct-code',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
