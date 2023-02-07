import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
    providedIn: 'root'
})

export class BrandWarrantyContactPersonsService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'brand-warranty-contact-persons';
    }
}
