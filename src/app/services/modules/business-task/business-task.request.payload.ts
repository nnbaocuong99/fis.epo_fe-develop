import { RequestPayload } from '../../common/http/request-payload.model';

export class BusinessTaskRequestPayload extends RequestPayload {
    name: string;
    operationId: string;
    operationIds: string[];
}
