import { RequestPayload } from '../../common/http/request-payload.model';

export class ExpenseBillRequestPayload extends RequestPayload {
    expenseId: string;
}
