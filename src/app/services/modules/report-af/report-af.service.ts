import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root',
})
export class ReportAFService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'report-af';
  }

  public exportAP0307(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-ap0307', requestPayload, 'Báo cáo tổng hợp công nợ phải trả nhà cung cấp ', true);
  }

  public exportAP0208(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-ap0208', requestPayload, 'Báo cáo liệt kê hóa đơn còn số dư ', true);
  }

  public exportAP04021(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-ap04021', requestPayload, 'Báo cáo liệt kê giao dịch chưa validate ', true);
  }

  public exportGL04021(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-gl04021', requestPayload, 'Báo cáo bảng kê hóa đơn, chứng từ hàng hóa, dịch vụ mua vào', true);
  }

  public exportSpendingPlan(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-spending-plan', requestPayload, 'Báo cáo kế hoạch chi', true);
  }

  public exportImportList(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-import-list', requestPayload, 'Báo cáo danh sách nhập', true);
  }

}
