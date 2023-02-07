import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
  providedIn: 'root',
})
export class ShipmentExportService extends HttpService {
  constructor() {
    super();
    this.url = this.origin + 'shipment-export';
  }

  public exportMenuOfGoods(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-menu-of-goods', requestPayload, 'Mẫu 1 - Danh mmục hàng hóa', true);
  }

  public exportCommercialList(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-commercial-list', requestPayload, 'Mẫu 2 - Bảng kê hóa đơn thương mại', true);
  }

  public exportElectronicDeclarationAppendix(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-electronic-declaration-appendix', requestPayload, 'Mẫu 3 - Phụ lục tờ khai điện tử', true);
  }

  public exportQualityRegistrationDocuments(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-quality-registration-documents', requestPayload, 'Mẫu 7 - Hồ sơ đăng ký chất lượng', true);
  }

  public exportRequestPayTaxAllSheet(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-request-pay-tax-all-sheet', requestPayload, 'Giấy đề nghị nộp thuế ', true);
  }

  public exportRequestPayTax(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-request-pay-tax', requestPayload, 'Giấy đề nghị nộp thuế ', true);
  }

  public exportStatementPayTax(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-statement-pay-tax', requestPayload, 'Bảng kê nộp thuế ', true);
  }

  public exportRequestPaymentCustomsFees(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-request-payment-customs-fees', requestPayload, 'Giấy đề nghị nộp lệ phí hải quan ', true);
  }

  public exportPayMoneyIntoStateBudget(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-pay-money-into-state-budget', requestPayload, 'Giấy nộp tiền vào ngân sách nhà nước ', true);
  }

  public exportRegisterCheckQualityOfGoods(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-register-check-quality-of-goods', requestPayload, 'Đăng ký kiểm tra chất lượng hàng hóa ', true, '.docx');
  }

  public exportQualitySelfAssessmentReport(requestPayload?: RequestPayload): Observable<any> {
    return this.exportFile('/export-quality-self-assessment-report', requestPayload, 'Báo cáo tự kiểm tra chất lượng ', true, '.docx');
  }

}
