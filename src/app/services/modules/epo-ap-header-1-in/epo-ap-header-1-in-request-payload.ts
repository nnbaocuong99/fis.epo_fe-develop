import { RequestPayload } from '../../common/http/request-payload.model';

export class EpoApHeader1InRequestPayload extends RequestPayload {
  id: string;
  year: number;
  month: number;
}
