import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { BaseResponse } from '../../common/http/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class IgEliminationService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'ig-elimination';
  }

  public deleteByShipmentId(id: string, isSpinner?: boolean): Observable<boolean> {
    return this.intercept(this.httpClient.delete(`${this.url}/delete-by-shipmentId/${id}`,
      { observe: 'response', headers: this.getHeaders() }), isSpinner)
      .pipe(map(r => r.body));
  }

  public deleteByPiId(id: string, isSpinner?: boolean): Observable<boolean> {
    return this.intercept(this.httpClient.delete(`${this.url}/delete-by-piId/${id}`,
      { observe: 'response', headers: this.getHeaders() }), isSpinner)
      .pipe(map(r => r.body));
  }

  public merge2(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
    return this.intercept(this.httpClient.post<any>(`${this.url}/merge2`,
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
      .pipe(map(r => r.body));
  }
}
