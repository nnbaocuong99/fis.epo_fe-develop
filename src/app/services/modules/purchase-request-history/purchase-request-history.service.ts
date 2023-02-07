import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestHistoryService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'purchase-request-history';
  }
}
