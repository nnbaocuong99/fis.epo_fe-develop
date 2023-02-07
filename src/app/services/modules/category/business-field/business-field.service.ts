import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
  providedIn: 'root',
})
export class BusinessFieldService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'business-field';
  }
}
