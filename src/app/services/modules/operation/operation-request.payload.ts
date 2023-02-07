import { RequestPayload } from '../../common/http/request-payload.model';

export class OperationRequestPayload extends RequestPayload {
    headerId: string;
    parentMenu: string;
    type: number;
    method: string;
    excludeIds: string[];
    id: string;
    excludeOperationId: string;
    includeOperationId: string;
    routePath: string;
    tag: string;
}
