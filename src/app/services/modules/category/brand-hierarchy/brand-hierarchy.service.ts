import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';
import { BrandHierarchyRequestPayload } from './brand-hierarchy.request.payload';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class BrandHierarchyService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'brand-hierarchy';
    }

    import(files: File[], requestPayload: BrandHierarchyRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new BrandHierarchyRequestPayload() : requestPayload;
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
