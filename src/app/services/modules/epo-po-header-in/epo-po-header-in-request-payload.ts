import { RequestPayload } from '../../common/http/request-payload.model';

export class EpoPoHeaderInRequestPayload extends RequestPayload {
  id: string;
  year: number;
  month: number;
}
