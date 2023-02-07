import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
    providedIn: 'root'
})

export class TaxTypeNotDeductionService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'tax-type-not-deduction';
    }
}
