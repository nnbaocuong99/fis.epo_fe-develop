import { RequestPayload } from '../../common/http/request-payload.model';

export class ShipmentRequestPayload extends RequestPayload {
    id: string;
    shipmentId: string;
    waybillNumber: string;
    hasPaging: boolean;
    ppId: string;
    prId: string;
    poId: string;
    piId: string;
}

export class ShipmentRequestSaveDto {
    shipment: any = {};
    shipmentPackageIdDeletes: string[] = [];
    shipmentPackage: any[] = [];
    shipmentItemIdDeletes: any[] = [];
    shipmentItem: any[] = [];
    purchaseOrderItem: any[] = [];
}


