import { RequestPayload } from '../../common/http/request-payload.model';

export class DataEpaymentRequestPayload extends RequestPayload {
  id: string;
  filter: string;
  segment3: string;
  organizationId: string;
  billTypeId: string;
  parentId: string;
  projectId: string;
  budgetPeriod: string;
  type: string;
  epayId: string;
  code: string;
}
