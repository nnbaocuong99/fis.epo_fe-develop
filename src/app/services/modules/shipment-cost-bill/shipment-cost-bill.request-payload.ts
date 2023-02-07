import { RequestPayload } from '../../common/http/request-payload.model';

export class ShipmentCostBillRequestPayload extends RequestPayload {
    shipmentId: string;
    isIncludeCancelStatus: boolean;
    keyword: string;
}


