import { RequestPayload } from '../../common/http/request-payload.model';

export class UserRequestPayload extends RequestPayload {
    // orgId: string;
    email: string;
    roleId: string;
    excludeIds: string[];
    ids: string[];
    id: string;
    subRoleType: string;
    userName: string;
    roleName: string;
}
