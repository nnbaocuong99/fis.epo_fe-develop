import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
    providedIn: 'root'
})

export class InputInvoiceInformationService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'input-invoice-information';
    }
}
