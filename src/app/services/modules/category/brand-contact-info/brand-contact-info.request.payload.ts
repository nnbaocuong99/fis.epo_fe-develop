import { RequestPayload } from '../../../common/http/request-payload.model';

export class BrandContactInfoRequestPayload extends RequestPayload {
    id: string;
    brandId: string;
}
