import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderHistoryService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'purchase-order-history';
  }
}
