import { RequestPayload } from '../../common/http/request-payload.model';

export class ConfigListRequestPayload extends RequestPayload {
    public type: string;
    public types: string[];
    public name: string;
}
