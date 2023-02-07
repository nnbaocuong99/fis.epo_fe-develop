import { Injectable } from '@angular/core';
import { HttpService } from '../../common';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExportModel } from './export.model';

@Injectable({
    providedIn: 'root'
})


export class ExportService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'api/export';
    }

    public export(body: ExportModel, fileName: string, isSpinner?: boolean): Observable<void> {
        if (isSpinner == null || isSpinner === undefined) { isSpinner = true; }
        if (isSpinner) { this.showSpinner(); }

        return this.httpClient.post(`${this.url}`, JSON.stringify(body), { headers: this.getHeaders(), responseType: 'blob' })
            .pipe(map(response => {
                if (isSpinner) { this.hideSpinner(); }
                FileSaver.saveAs(response, fileName + new Date().getTime() + '.xlsx');
            }, (error: any) => {
                if (isSpinner) {
                    console.log(error);
                    this.hideSpinner();
                }
            }));
    }
}
