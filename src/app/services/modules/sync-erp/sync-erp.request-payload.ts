import { RequestPayload } from '../../common/http/request-payload.model';

export class SyncErpRequestPayload extends RequestPayload {
    id: string;
    shipmentId: string;
    piId: string;
}
