import { RequestPayload } from '../../common/http/request-payload.model';

export class TempMailRequestPayload extends RequestPayload {
    title: string;
    status: number;
}


