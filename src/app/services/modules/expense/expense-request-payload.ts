import { RequestPayload } from '../../common/http/request-payload.model';

export class ExpenseRequestPayload extends RequestPayload {
  id: string;
}

export class ExpenseRequestSaveDto {
  expense: any = {};
  expenseBill: any[] = [];
  expensePayment: any[] = [];
}
