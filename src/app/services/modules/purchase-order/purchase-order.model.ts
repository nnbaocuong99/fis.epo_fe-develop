import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseOrderDto extends RequestPayload {
    id: string;
    itemVerNo: number;
}
