import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseInvoicePaymentRequestPayload extends RequestPayload {
    piId: string = null;
    code: string = null;
    poCode: string = null;
    vendorId: string = null;
    amount: number = null;
    mapAmountInvoice: boolean = null;
}
