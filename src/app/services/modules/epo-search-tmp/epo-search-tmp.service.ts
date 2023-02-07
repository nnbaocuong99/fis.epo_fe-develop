import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root'
})

export class EpoSearchTmpService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'epo-search-tmp';
  }

  public selectTotalAmount(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/total-amount',
      { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
      .pipe(map(r => r.body));
  }

  public export(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export', requestPayload, 'Báo cáo đồng bộ update cost ', true);
  }
}
