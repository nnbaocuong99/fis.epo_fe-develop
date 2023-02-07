import { Injectable } from '@angular/core';
import { HttpService } from '../../../../common';

@Injectable({
    providedIn: 'root'
})

export class OrganizationService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'organization';
    }
}
