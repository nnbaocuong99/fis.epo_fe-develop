import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
    providedIn: 'root'
})
export class PurchaseOrderPaymentService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'purchase-order-payment';
    }

}
