import { RequestPayload } from '../../common/http/request-payload.model';

export class ShipmentItemRequestPayload extends RequestPayload {
    id: string;
    shipmentId: string;
    generalFilter: string;
    importStatus: boolean;
    listPiItemId: any;
}
