import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
  providedIn: 'root',
})
export class SubInventoryService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'sub-inventory';
  }
}
