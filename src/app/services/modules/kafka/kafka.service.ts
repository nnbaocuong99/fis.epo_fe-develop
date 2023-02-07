import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';

@Injectable({
    providedIn: 'root'
})

export class KafkaService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'kafka';
    }

    public postAsync(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url, JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
