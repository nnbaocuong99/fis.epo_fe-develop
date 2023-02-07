import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseAttachmentRequestPayload extends RequestPayload {
    recordId: string;
    module: string;
}

