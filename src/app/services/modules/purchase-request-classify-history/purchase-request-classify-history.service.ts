import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestClassifyHistoryService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'purchase-request-classify-history';
  }
}
