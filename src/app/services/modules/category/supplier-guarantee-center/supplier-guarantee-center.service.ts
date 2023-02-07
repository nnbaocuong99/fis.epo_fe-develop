import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { HttpService } from '../../../common';
import { RequestPayload } from '../../../common/http/request-payload.model';

@Injectable({
    providedIn: 'root'
})

export class SupplierGuaranteeCenterService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'supplier-guarantee-center';
    }
}
