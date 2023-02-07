import { Injectable } from '@angular/core';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestItemHistoryService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'purchase-request-item-history';
  }

  public selectTotalBom(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/total-bom',
      { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
      .pipe(map(r => r.body));
  }
}
