import { RequestPayload } from '../../common/http/request-payload.model';

export class ShipmentQualityRequestPayload extends RequestPayload {
    shipmentId: string;
    type: string;
}

