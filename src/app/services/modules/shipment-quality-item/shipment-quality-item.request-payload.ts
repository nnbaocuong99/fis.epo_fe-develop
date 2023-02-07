import { RequestPayload } from '../../common/http/request-payload.model';

export class ShipmentQualityItemServiceRequestPayload extends RequestPayload {
    shipmentId?: string;
    type?: number;
}

