import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseRequestDto extends RequestPayload {
    id: string;
    itemVerNo: number;
}
