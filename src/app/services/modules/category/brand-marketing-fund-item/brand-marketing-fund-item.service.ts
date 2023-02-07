import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
    providedIn: 'root'
})

export class BrandMarketingFundItemService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'brand-marketing-fund-item';
    }

}
