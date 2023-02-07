import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseOrderItemBulkMatchRequestPayload extends RequestPayload {
    purchaseOrderItem: any[];
    purchaseRequestItem: any[];
    idPoDelete: string[];
}
