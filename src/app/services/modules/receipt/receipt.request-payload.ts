import { RequestPayload } from '../../common/http/request-payload.model';

export class ReceiptRequestPayload extends RequestPayload {
    shipmentId: string = null;
    piId: string = null;
}
