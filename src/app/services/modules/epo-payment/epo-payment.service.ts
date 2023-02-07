import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
  providedIn: 'root'
})

export class EpoPaymentService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'epo-payment';
  }

}
