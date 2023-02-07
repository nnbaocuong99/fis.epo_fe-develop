import { Injectable } from '@angular/core';
import { HttpService } from '../../common';

@Injectable({
  providedIn: 'root',
})
export class IgEliminationDetailService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'ig-elimination-detail';
  }
}
