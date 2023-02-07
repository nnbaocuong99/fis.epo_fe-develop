import { Injectable } from '@angular/core';
import { HttpService } from '../../common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class ExpenseService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'expense';
  }

  public save(body: any, isSpinner?: boolean): Observable<any> {
    const request = this.httpClient.post<boolean>(`${this.url}/save`,
      JSON.stringify(body), { observe: 'response', headers: this.getHeaders() });
    return this.intercept(request, isSpinner).pipe(map(r => r.body));
  }

}
