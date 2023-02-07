import { RequestPayload } from '../../../common/http/request-payload.model';

export class ItemRequestPayload extends RequestPayload {
    code: string;
    mapName: string;
    mapPartNumber: string;
    generalFilter: any;
    listCode: any[];
    type: string;
}
