import { RequestPayload } from '../../common/http/request-payload.model';

export class EpoSearchTmpRequestPayload extends RequestPayload {
  id: string;
  year: number;
  month: number;
}
