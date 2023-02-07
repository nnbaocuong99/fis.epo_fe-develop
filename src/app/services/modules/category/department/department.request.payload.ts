import { RequestPayload } from '../../../common/http/request-payload.model';

export class DepartmentRequestPayload extends RequestPayload {
    code: string;
    companyCode: string;
    ouId: string;
}
