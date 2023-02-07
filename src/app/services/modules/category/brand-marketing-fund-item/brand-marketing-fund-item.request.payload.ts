import { RequestPayload } from '../../../common/http/request-payload.model';

export class BrandMarketingFundItemRequestPayload extends RequestPayload {
    brandId: string;
    brandMarketingFundId: string;
}
