import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
    providedIn: 'root'
})

export class PaymentTermService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'payment-term';
    }
}
