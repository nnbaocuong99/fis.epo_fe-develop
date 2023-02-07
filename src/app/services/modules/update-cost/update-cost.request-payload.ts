import { RequestPayload } from '../../common/http/request-payload.model';

export class UpdateCostRequestPayload extends RequestPayload {
  piId: string;
  shipmentId: string;
}