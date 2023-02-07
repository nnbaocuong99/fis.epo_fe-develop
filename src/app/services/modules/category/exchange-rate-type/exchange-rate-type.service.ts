import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/common/http/http.service';

@Injectable({
    providedIn: 'root'
})

export class ExchangeRateTypeService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'exchange-rate-type';
    }
}
