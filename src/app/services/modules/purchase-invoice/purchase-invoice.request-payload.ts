import { RequestPayload } from '../../common/http/request-payload.model';

export class PurchaseInvoiceRequestPayload extends RequestPayload {
    id: string;
    tiId: string;
    piId: string;
    code: string;
    seriNo: string;
    symbol: string;
    vendorId: string;
    status: string;
    idHide: string;
    costType: string;
    filterCostType: string;
    waybillNumber: string;
    notYetAddUpdateCost: boolean;
    inUpdateCost: boolean;
    hasTermAccount: boolean;
    ppId: string;
    prId: string;
    poId: string;
}

export class PurchaseInvoiceRequestSaveDto {
    purchaseInvoice: any = {};
    idPiItemDeletes: string[] = [];
    purchaseInvoiceItem: any[] = [];
    purchaseOrderItem: any[] = [];
}

export class PurchaseInvoiceRequestSaveTaxDto {
    purchaseInvoiceContractorTax: any = {};
    purchaseInvoiceItemsContractorTax: any[] = [];
}
