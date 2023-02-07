import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchasePlanItemRequestPayload extends RequestPayload {
    id: string;
    name: string;
    ppId: string; // Purchase plan id
    itemVerNo: string;
    isSubItem: boolean;
    subIndexNo: string;
    generalFilter: string;
}
