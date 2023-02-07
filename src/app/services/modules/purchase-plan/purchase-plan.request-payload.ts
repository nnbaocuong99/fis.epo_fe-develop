import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchasePlanRequestPayload extends RequestPayload {
    headerId: string;
    projectCode: string;
    code: string;
    amAccount: string;
    pmAccount: string;
    contractNo: string;
    contractType: string;
    status?: string;
    customer: string;
    fromDate: Date;
    toDate: Date;
    createdByName: string;
    generalFilter: string;
}
