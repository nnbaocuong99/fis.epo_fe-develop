import { RequestPayload } from '../../common/http/request-payload.model';

export class AllCodeCombinationsRequestPayload extends RequestPayload {
    type: string;
    company: string;
    regions: string;
    subDepartment: string;
    account: string;
    businessField: string;
    businessType: string;
    intercompany: string;
    preventive: string;
    allCode: string;
}
