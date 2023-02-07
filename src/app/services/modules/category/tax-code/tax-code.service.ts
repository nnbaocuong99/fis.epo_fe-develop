import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/common/http/http.service';

@Injectable({
  providedIn: 'root'
})

export class TaxCodeService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'tax-code';
  }
}
