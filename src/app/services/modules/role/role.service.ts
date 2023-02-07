import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';

@Injectable({
    providedIn: 'root'
})

export class RoleService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'role';
    }

    public bulkMergeRoleOperation(body: string[], roleId: string, isSpinner?: boolean): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/merge-role-operation/${roleId}`, JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectRoleOperation(roleId: string, isSpinner?: boolean): Observable<string[]> {
        return this.intercept(this.httpClient.get<string[]>(`${this.url}/select-role-operation/${roleId}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectMenuOperation(roleId: string, isSpinner?: boolean): Observable<any[]> {
        return this.intercept(this.httpClient.get<any[]>(`${this.url}/select-menu-operation/${roleId}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectMenuOperationCustomized(roleId: string, isSpinner?: boolean): Observable<any[]> {
        return this.intercept(this.httpClient.get<any[]>(`${this.url}/select-menu-operation-customized/${roleId}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
