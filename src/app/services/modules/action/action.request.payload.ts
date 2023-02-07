import { RequestPayload } from '../../common/http/request-payload.model';

export class ActionRequestPayload extends RequestPayload {
    name: string;
    id: string;
    routePath: string;
    tag: string;
    method: string;
    excludeOperationId: string;
    includeOperationId: string;
}
