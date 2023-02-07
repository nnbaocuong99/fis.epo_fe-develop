import { RequestPayload } from '../../common/http/request-payload.model';

export class BranchRequestPayload extends RequestPayload {
  code: string;
  name: string;
}
