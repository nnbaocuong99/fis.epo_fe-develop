import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseInvoiceItemRequestPayload extends RequestPayload {
    id: string;
    piId: string; // Purchase invoice id
    poId: string; // Purchase order id
    piIds: string[];
    generalFilter: string;
    listPoItemId: any;
}
