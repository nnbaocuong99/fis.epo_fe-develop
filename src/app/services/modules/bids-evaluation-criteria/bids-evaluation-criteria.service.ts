import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root',
})
export class BidsEvaluationCriteriaService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'bids-evaluation-criteria';
  }

}
