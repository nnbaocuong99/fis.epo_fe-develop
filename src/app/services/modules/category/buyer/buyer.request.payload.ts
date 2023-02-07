import { RequestPayload } from '../../../common/http/request-payload.model';

export class BuyerRequestPayload extends RequestPayload {
    personId: number;
    lastName: string;
    userName: string;
}
