import { RequestPayload } from '../../../common/http/request-payload.model';

export class BusinessTypeRequestPayload extends RequestPayload {
    code: string;
    businessFieldCode: string;
}
