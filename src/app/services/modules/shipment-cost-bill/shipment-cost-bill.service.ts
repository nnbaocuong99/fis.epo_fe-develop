import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';

@Injectable({
    providedIn: 'root'
})

export class ShipmentCostBillService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'shipment-cost-bill';
    }
}
