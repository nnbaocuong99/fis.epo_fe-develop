import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FileInfo, FileRequestPayload } from './file.request.payload';
import * as FileSaver from 'file-saver';
import { map, tap } from 'rxjs/operators';
import { HttpService } from '../../common';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class FileService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'file';
    }

    public download(file: FileInfo): Subscription {
        const request = this.httpClient.get(`${this.url}/${file.id}`,
            { headers: this.getHeaders(), responseType: 'blob' });
        return request.subscribe(response => {
            FileSaver.saveAs(response, file.name);
        });
    }

    public getFileInfo(file: FileInfo): Observable<Blob> {
        return this.httpClient.get(`${this.url}/${file.id}`,
            { headers: this.getHeaders(), responseType: 'blob' }).pipe(tap(() => {

            }, (err: HttpErrorResponse) => {
                // this.throwException(err);
            }));
    }

    public selectDistinctModule(requestPayload?: FileRequestPayload, isSpinner?: boolean): Observable<string[]> {
        requestPayload = !requestPayload ? new FileRequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<string[]>(this.url + '/select-distinct-module',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectById(id: string, isSpinner?: boolean): Observable<string[]> {
        return this.intercept(this.httpClient.get<string[]>(this.url + `/select/${id}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectObjectHasFileInModule(requestPayload?: FileRequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new FileRequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + `/select-object-has-file-in-module`,
            { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public upload(files: File[], requestPayload: FileRequestPayload, isShowLoading?: boolean): Observable<boolean> {
        requestPayload = !requestPayload ? new FileRequestPayload() : requestPayload;
        const formData = new FormData();
        const response = this.httpClient.post<boolean>(
            `${this.url}/upload`,   // URL
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
