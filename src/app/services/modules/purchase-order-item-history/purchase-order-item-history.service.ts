import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderItemHistoryService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'purchase-order-item-history';
  }
}
