import { RequestPayload } from '../../common/http/request-payload.model';

export class QuotationSupplierRequestPayload extends RequestPayload {
    id: string;
    requestForQuotationId: string;
}
