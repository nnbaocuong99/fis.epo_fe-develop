import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
  providedIn: 'root'
})
export class PurchasePlanHistoryService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'purchase-plan-history';
  }
}
