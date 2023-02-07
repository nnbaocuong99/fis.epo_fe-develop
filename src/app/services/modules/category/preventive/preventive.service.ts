import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
  providedIn: 'root',
})
export class PreventiveService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'preventive';
  }
}
