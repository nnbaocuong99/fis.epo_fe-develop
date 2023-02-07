import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseOrderHistoryRequestPayload extends RequestPayload {
  poId: string;
}
