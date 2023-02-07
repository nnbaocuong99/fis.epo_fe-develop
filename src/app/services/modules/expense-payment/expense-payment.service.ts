import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
    providedIn: 'root'
})

export class ExpensePaymentService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'expense-payment';
    }
}
