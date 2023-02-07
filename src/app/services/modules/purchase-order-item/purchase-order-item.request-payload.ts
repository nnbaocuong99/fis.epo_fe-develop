import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseOrderItemRequestPayload extends RequestPayload {
    id: string;
    poId: string; // Purchase order id
    piId: string;
    listReceiptId: any;
    isSubItem: boolean;
    indexNo: string;
    appendix: boolean;
    receiptId: boolean;
    matchedId: string;
    listPrItemId: any;
    isInternal: boolean;
    partNo: any;
    itemType: any;
    itemCode: any;
    itemName: any;
}
