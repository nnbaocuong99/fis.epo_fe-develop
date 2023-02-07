import { RequestPayload } from './../../common/http/request-payload.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class UserService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'user';
    }

    public deleteUserFromRole(request: RequestPayload, isSpinner?: boolean): Observable<boolean> {
        return this.intercept(this.httpClient.delete(`${this.url}/delete-user-role`,
            { observe: 'response', headers: this.getHeaders(), params: this.toParams(request) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectSubRoleUser(request: RequestPayload, isSpinner?: boolean): Observable<any[]> {
        return this.intercept(this.httpClient.get<any[]>(`${this.url}/select-sub-role-user`,
            { observe: 'response', headers: this.getHeaders(), params: this.toParams(request) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public checkUserNameExist(requestPayload?: any, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/check-username-exist',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public import(files: File[], requestPayload: RequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        const formData = new FormData();
        const response = this.httpClient.post<boolean>(
            `${this.url}/import`,   // URL
            formData,               // Form data
            {
                observe: 'response',
                headers: new HttpHeaders({ 'id-token': this.getCookie('id-token') }),
                params: requestPayload.toParams()
            }); // Option

        for (const file of files) {
            formData.append('files', file, file.name);
        }

        return this.intercept(response, isShowLoading).pipe(map(r => r.body));
    }
}
