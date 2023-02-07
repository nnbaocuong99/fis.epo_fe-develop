import { RequestPayload } from '../../common/http/request-payload.model';
import { PurchaseRequestItemDto } from './purchase-request-item.model';

export class PurchaseRequestItemRequestPayload extends RequestPayload {
    id: string;
    name: string;
    prId: string; // Purchase request id
    itemVerNo: string;
    isSubItem: boolean;
    subIndexNo: string;
    areaType: number;
    matchedId: string;
    classifyType: number;
    ipoNumber: any;
}

export class DeleteThenInsertRequestDto {
    idsDelete: string[];
    listInsert: PurchaseRequestItemDto[];
}
