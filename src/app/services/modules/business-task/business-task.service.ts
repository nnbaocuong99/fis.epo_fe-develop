import { Injectable } from '@angular/core';
import { HttpService } from '../../common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessTaskRequestPayload } from './business-task.request.payload';

@Injectable({
    providedIn: 'root'
})

export class BusinessTaskService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'business-task';
    }

    public mergeWithRelationToOperation(body: any, isSpinner?: boolean, params?: any): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/merge-with-relation-to-operation`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectOperationBusinessTask(requestPayload?: BusinessTaskRequestPayload, isSpinner?: boolean): Observable<any[]> {
        requestPayload = !requestPayload ? new BusinessTaskRequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any[]>(this.url + '/select-operation-business-task',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countOperationBusinessTask(requestPayload?: BusinessTaskRequestPayload, isSpinner?: boolean): Observable<number> {
        requestPayload = !requestPayload ? new BusinessTaskRequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<number>(this.url + '/count-operation-business-task',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public deleteOperationBusinessTask(requestPayload?: BusinessTaskRequestPayload, isSpinner?: boolean): Observable<boolean> {
        return this.intercept(this.httpClient.delete(`${this.url}/delete-operation-business-task`,
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
