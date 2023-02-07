import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseRequestRequestPayload extends RequestPayload {
    headerId: string;
    subDepartmentId: string = null;
    projectCode: string = null;
    prNo: string = null;
    orgCode: string = null;
    contractNo: string = null;
    fromDate: Date = null;
    toDate: Date = null;
    legal: string = null;
    legalName: string = null;
    prType: string = null;
    contractInfo: string = null;
    prStatus: string = null;
    areaType: number;
    taxpayer: number;
    ppId: string;
    subDepartment: string;
    amPm: string;
    supplierName: string;
    producerName: string;
    poMan: string;
    contractServiceType: string;
    currency: string;
    idViewMatch: string;
    rootPrId: string;
    isViewAll = true;
    producerNameDto: any;
}
