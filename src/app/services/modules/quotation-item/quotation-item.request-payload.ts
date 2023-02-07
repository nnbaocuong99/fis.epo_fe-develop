import { RequestPayload } from '../../common/http/request-payload.model';

export class QuotationItemRequestPayload extends RequestPayload {
    id: string;
    requestForQuotationId: string;
    supplierId: string;
}
