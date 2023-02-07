import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../common';
import { BaseResponse } from '../../../common/http/base-response.model';

@Injectable({
    providedIn: 'root'
})

export class CustomsBranchService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'customs-branch';
    }

    public save(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/save`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

}
