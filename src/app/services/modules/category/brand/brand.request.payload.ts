import { RequestPayload } from '../../../common/http/request-payload.model';

export class BrandRequestPayload extends RequestPayload {
    id: string;
    code: string;
    name: string;
    brandYear: number;
    haspaging: boolean;
}

export class BrandRequestSaveDto {
    brand: any = {};
    brandRevenue: any[] = [];
    brandMembershipRequirement: any[] = [];
    brandWarrantyContactPersons: any[] = [];
    brandContactInfo: any[] = [];
    brandHierarchy: any[] = [];
    brandCoreSolutions: any[] = [];
    brandMarketingFund: any[] = [];
    brandMarketingFundItem: any[] = [];
}
