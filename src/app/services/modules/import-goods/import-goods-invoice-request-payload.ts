import { RequestPayload } from '../../common/http/request-payload.model';

export class ImportGoodsInvoiceRequestPayload extends RequestPayload {
    note: string;
    piItems: any[];
}
