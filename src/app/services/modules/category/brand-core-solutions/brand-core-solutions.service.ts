import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../common';
import { BrandCoreSolutionsRequestPayload } from './brand-core-solutions.request.payload';

@Injectable({
    providedIn: 'root'
})

export class BrandCoreSolutionsService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'brand-core-solutions';
    }

    import(files: File[], requestPayload: BrandCoreSolutionsRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new BrandCoreSolutionsRequestPayload() : requestPayload;
        const formData = new FormData();
        const response = this.httpClient.post<boolean>(
            `${this.url}/import`,   // URL
            formData,               // Form data
            {
                observe: 'response',
                headers: this.getHeaders(),
                params: requestPayload.toParams()
            }); // Option

        for (const file of files) {
            formData.append('files', file, file.name);
        }

        return this.intercept(response, isShowLoading).pipe(map(r => r.body));
    }
}
