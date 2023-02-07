import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'report';
  }

  public exportCargoTracking(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-cargo-tracking', requestPayload, 'Báo cáo theo dõi hàng hóa ', true);
  }

  public exportPoInfoSupportRebateTool(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-purchase-order-rebate', requestPayload, 'Báo cáo thông tin đơn hàng (Hỗ trợ rebate tool) ', true);
  }

  public exportContractorTax(requestPayload?: RequestPayload, exportFileName?: string): Observable<void> {
    return this.exportFile('/export-contractor-tax', requestPayload, exportFileName, true);
  }

  public exportPoItemsForGuarantee(requestPayload?: RequestPayload, exportFileName?: string): Observable<any> {
    return this.exportFile('/export-purchase-order-guarantee', requestPayload, exportFileName, true);
  }

  public exportBrandHierarchy(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-brand-hierarchy', requestPayload, 'Báo cáo phân cấp đối tác hãng ', true);
  }

  public exportBrandVendorsPolicy(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-brand-vendors-policy', requestPayload, 'Báo cáo chính sách nhà cung cấp của hãng ', true);
  }

  public exportPoMan(requestPayload?: RequestPayload, exportFileName?: string): Observable<any> {
    return this.exportFile('/export-purchase-order-man', requestPayload, exportFileName, true);
  }

  public exportInvoiceImportGoodsTracking(requestPayload?: RequestPayload, exportFileName?: string): Observable<any> {
    return this.exportFile('/export-invoice-import-goods-tracking', requestPayload, exportFileName, true);
  }

  public exportInvoiceBp(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-invoice-bp', requestPayload, 'Báo cáo hóa đơn BP ', true);
  }

  public exportPurchaseRequestTracking(requestPayload?: RequestPayload, exportFileName?: string): Observable<any> {
    return this.exportFile('/export-purchase-request-tracking', requestPayload, exportFileName, true);
  }

}
