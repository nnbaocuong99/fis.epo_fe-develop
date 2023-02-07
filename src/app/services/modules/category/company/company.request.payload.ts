import { RequestPayload } from '../../../common/http/request-payload.model';

export class CompanyRequestPayload extends RequestPayload {
    code: string;
    ouId: string;
}
