import { RequestPayload } from '../../common/http/request-payload.model';

export class IgEliminationRequestPayload extends RequestPayload {
  piId: string;
  shipmentId: string;
  updateCostId: string;
}
