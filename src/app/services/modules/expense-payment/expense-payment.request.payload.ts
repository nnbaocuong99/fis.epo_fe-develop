import { RequestPayload } from '../../common/http/request-payload.model';

export class ExpensePaymentRequestPayload extends RequestPayload {
    expenseId: string;
}
