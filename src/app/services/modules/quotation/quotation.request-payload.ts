import { RequestPayload } from '../../common/http/request-payload.model';

export class QuotationRequestPayload extends RequestPayload {
    id: string;
    supplierId: string;
}
