import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseOrderItemHistoryRequestPayload extends RequestPayload {
  poHistoryId: string;
}
