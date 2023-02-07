import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root',
})
export class ReportXNKService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'report-xnk';
  }

  public exportExpectedGoodsToArrive(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-expected-goods-to-arrive', requestPayload, 'Báo cáo dự kiến hàng về theo hợp đồng đầu ra ', true);
  }

  public exportPaymentPlan(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-payment-plan', requestPayload, 'Báo cáo kế hoạch thanh toán ', true);
  }

  public exportShipmentStatus(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-shipment-status', requestPayload, 'Báo cáo tình trạng lô hàng ', true);
  }

  public exportForeignPurchaseOrder(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-foreign-purchase-order', requestPayload, 'Báo cáo tổng hợp đặt hàng ngoại ', true);
  }

  public exportPurchaseOrderValueBySupplier(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-purchase-order-value-by-supplier', requestPayload, 'Báo cáo trị giá đặt hàng theo NCC ', true);
  }

  public exportPaymentTracking(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-payment-tracking', requestPayload, 'Báo cáo theo dõi thanh toán  ', true);
  }

  public exportOrderClassifyBySupplier(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-order-classify-by-supplier', requestPayload, 'Báo cáo phân loại đặt hàng theo nhà cung cấp ', true);
  }

  public exportOrderFulfillmentTimeBySupplier(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-order-fulfillment-time-by-supplier', requestPayload, 'Báo cáo thời gian thực hiện đơn hàng theo nhà cung cấp ', true);
  }

}
