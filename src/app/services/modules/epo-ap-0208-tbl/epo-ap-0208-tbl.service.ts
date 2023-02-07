import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root'
})

export class EpoAp0208TblService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'epo-ap-0208-tbl';
  }

  public selectAccountName(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/select-account-name',
      { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
      .pipe(map(r => r.body));
  }

}
