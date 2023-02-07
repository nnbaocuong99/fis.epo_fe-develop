import { RequestPayload } from '../../common/http/request-payload.model';

export class MailScheduleRequestPayload extends RequestPayload {
    id: string;
    sendTo: string;
}

