import { Injectable } from '@angular/core';
import { HttpService } from '../../common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../../common/http/base-response.model';

@Injectable({
    providedIn: 'root'
})

export class BpmService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'bpm';
    }

    public createDraft(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/create-draft', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public create(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/create', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getTicket(ticketId: number, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.get<any>(this.url + `/get-ticket/${ticketId}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getTicketProcess(ticketId: number, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.get<any>(this.url + `/get-ticket-process/${ticketId}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public reject(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/reject', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public approve(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/approve', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public start(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/start', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public finish(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/finish', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getServices(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/get-services', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getProcess(id: number, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.get<any>(this.url + `/get-process/${id}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public cancel(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/cancel', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public confirmClose(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/confirm-close', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public changeImplementer(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/change-implementer', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public requestUpdateOutput(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/request-update-output', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getPhaseDetail(phaseId: number, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.get<any>(this.url + `/get-phase-detail/${phaseId}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public upload(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/upload', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getComboboxData(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/get-combobox-data', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countComboboxData(body: any, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.post<any>(this.url + '/count-combobox-data', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public getSearchData(type: any, isSpinner?: boolean): any {
        return this.intercept(this.httpClient.get<any>(this.url + `/get-search-data`,
            { observe: 'response', headers: this.getHeaders(), params: type.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countSearchData(type: any, isSpinner?: boolean): any {
        return this.intercept(this.httpClient.get<any>(this.url + `/count-search-data`,
            { observe: 'response', headers: this.getHeaders(), params: type.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
