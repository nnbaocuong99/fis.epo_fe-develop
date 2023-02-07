import { RequestPayload } from '../../../common/http/request-payload.model';

export class SupplierRequestPayload extends RequestPayload {
    id: string;
    code: string;
    email: string;
}
