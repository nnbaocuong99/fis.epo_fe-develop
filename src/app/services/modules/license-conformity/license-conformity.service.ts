import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../common';
import { LicenseConformityRequestPayload } from './license-conformity.request-payload';


@Injectable({
    providedIn: 'root'
})

export class LicenseConformityService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'license-conformity';
    }

    public exportAll(requestPayload: LicenseConformityRequestPayload): Observable<void> {
        return this.exportFile('/export-all', requestPayload, 'p-license-conformity', true);
    }

}
