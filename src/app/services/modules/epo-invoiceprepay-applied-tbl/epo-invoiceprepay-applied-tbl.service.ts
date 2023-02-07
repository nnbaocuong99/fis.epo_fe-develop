import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
  providedIn: 'root'
})

export class EpoInvoiceprepayAppliedTblService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'epo-invoiceprepay-applied-tbl';
  }

}
