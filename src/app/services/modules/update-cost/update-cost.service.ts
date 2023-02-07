import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common/http/http.service';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateCostService extends HttpService {

  constructor() {
    super();
    this.url = this.origin + 'update-cost';
  }

  public checkAllowAdd(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
    requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
    return this.intercept(this.httpClient.get<any>(this.url + '/check-allow-add',
      { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
      .pipe(map(r => r.body));
  }

}
