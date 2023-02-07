import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';

@Injectable({
    providedIn: 'root'
})

export class MappingSproService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'mapping-spro';
    }

    public getModel(model: string, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.get<any>(this.url + `/get-model/${model}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
