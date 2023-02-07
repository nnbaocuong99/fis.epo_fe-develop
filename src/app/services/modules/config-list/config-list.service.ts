import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { ConfigListRequestPayload } from './config-list.request.payload';

@Injectable({
    providedIn: 'root'
})

export class ConfigListService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'config-list';
    }

    public selectDistinctType(isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.get<any>(this.url + `/distinct-type`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectBaseInfo(requestPayload?: ConfigListRequestPayload, isSpinner?: boolean): Observable<any[]> {
        requestPayload = !requestPayload ? new ConfigListRequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any[]>(this.url + `/select-base-info`,
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
