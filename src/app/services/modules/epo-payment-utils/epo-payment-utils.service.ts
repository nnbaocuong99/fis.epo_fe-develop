import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
  providedIn: 'root'
})

export class EpoPaymentUtilsService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'epo-payment-utils';
  }

}
