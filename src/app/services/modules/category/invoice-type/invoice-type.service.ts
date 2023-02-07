import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/common/http/http.service';

@Injectable({
  providedIn: 'root'
})

export class InvoiceTypeService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'invoice-type';
  }
}
