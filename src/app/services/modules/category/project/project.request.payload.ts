import { RequestPayload } from "../../../common/http/request-payload.model";

export class ProjectRequestPayload extends RequestPayload {
    code: string;
    ouId: string;
    projectId: any;
}
