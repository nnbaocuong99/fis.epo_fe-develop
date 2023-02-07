import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseRequestClassifyHistoryRequestPayload extends RequestPayload {
  id: string;
  prId: string;
  prItemId: string;
  type: string;
}
