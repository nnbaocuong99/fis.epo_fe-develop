import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestPayload } from '../../../common/http/request-payload.model';
import { BrandContactInfoRequestPayload } from './brand-contact-info.request.payload';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})

export class BrandContactInfoService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'brand-contact-info';
    }

    public exportList(requestPayload?: RequestPayload): Observable<any> {
        return this.exportFile('/export-list', requestPayload, 'Danh sách thông tin liên hệ hãng ', true);
    }

    public exportListAllForBrandToManySheet(requestPayload?: RequestPayload): Observable<any> {
        return this.exportFile('/export-list-for-brand-to-many-sheet', requestPayload,
            'Danh sách thông tin liên hệ hãng theo sheet ', true
        );
    }

    import(files: File[], requestPayload: BrandContactInfoRequestPayload, isShowLoading?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new BrandContactInfoRequestPayload() : requestPayload;
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
