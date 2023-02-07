import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseOrderRequestPayload extends RequestPayload {
    id: string = null;
    rootPoId: string = null;
    projectCode: string = null;
    code: string = null;
    fromDate: Date = null;
    toDate: Date = null;
    areaType: number = null;
    taxpayer: number = null;
    ouCode: string = null;
    orgCode: string = null;
    subDepartmentId: string = null;
    status: string = null;
    currency: string = null;
    hasCo: boolean = null;
    hasCq: boolean = null;
    supplierName: string = null;
    producerName: string = null;
    guarantee: number = null;
    deliveryLocation: string = null;
    itemType: string = null;
    isConformity: boolean = null;
    hasTermAccount: boolean = null;
    productType: string;
    poCode: string;
    partNo: string;
    itemName: string;
    syncStatus: number;
    supplierSite: string;
    createBy: string;
    poId: string; // biến dùng cho chức năng check trùng code
    ouId: string;
    isFilterReferencePo: boolean;
    idFilterReferencePo: string;
    generalFilter: string;
    vendorId: any;
    ppId: string;
    prId: string;
}
