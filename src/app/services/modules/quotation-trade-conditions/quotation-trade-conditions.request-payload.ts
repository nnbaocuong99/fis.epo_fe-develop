import { RequestPayload } from '../../common/http/request-payload.model';

export class QuotationTradeConditionsRequestPayload extends RequestPayload {
    id: string;
    requestForQuotationId: string;
    supplierId: string;
}
