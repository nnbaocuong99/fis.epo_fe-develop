import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
    providedIn: 'root'
})

export class BrandMarketingFundService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'brand-marketing-fund';
    }

}
