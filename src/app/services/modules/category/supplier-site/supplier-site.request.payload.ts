import { RequestPayload } from '../../../common/http/request-payload.model';

export class SupplierSiteRequestPayload extends RequestPayload {
    vendorId: string;
    siteId: string;
    ouId: string;
    code: string;
    name: string;
}
