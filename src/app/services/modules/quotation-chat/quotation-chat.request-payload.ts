import { RequestPayload } from '../../common/http/request-payload.model';

export class QuotationChatRequestPayload extends RequestPayload {
    id: string;
    requestForQuotationId: string;
    supplierId: string;
}
