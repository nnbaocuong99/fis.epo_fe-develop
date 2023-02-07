import { RequestPayload } from '../../common/http/request-payload.model';

export class ImportGoodsRequestPayload extends RequestPayload {
    type?: number;
    source?: number;
    importStatus?: number;
    elimStatus?: number;
    shipment?: any = {};
    invoice?: any = {};
}
