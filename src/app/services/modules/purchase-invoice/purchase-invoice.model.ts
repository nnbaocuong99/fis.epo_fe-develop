import { BaseResponse } from '../../common/http/base-response.model';

export class PurchaseInvoiceDto extends BaseResponse {
    modifiedBy: string;
    createdAt: Date | string | null;
    createdBy: string;
    projectMilestone: string;
    termAccount: string;
    waybillNumber: string;
    noteAf: string;
    isDeduct: number | null;
    invoiceDesc: string;
    poCode: string;
    receivingDept: string;
    isStoring: number | null;
    modifiedAt: Date | string | null;
    exchangeRate: number | null;
    supplierSite: string;
    supplierTax: string;
    supplierName: string;
    syncStatus: number;
    status: number;
    costType: string;
    symbol: string;
    seriNo: string;
    taxType: string;
    invoiceType: string;
    code: string;
    id: string;
    currency: string;

    invoiceTypeDto: any;
    invoiceTypeOnListDto: any;
    supplierNameDto: any;
    supplierSiteNameDto: any;
    receivingDeptNameDto: any;
    poCodeDto: any;
    waybillNumberDto: any;
    fullNameDto: any;
    createdByInvoiceDto: any;
    invoiceExportedNoDto: any;
    projectCodeDto: any;
    ouNameDto: any;
    orgApplyNameDto: any;
    taxTypeDto: any;
    currencyDto: any;
    paymentTermDto: any;

    constructor(source?: any) {
        super(source);
        if (source) {
            this.invoiceTypeDto = this.toDto('name', source.invoiceType);
            this.invoiceTypeOnListDto = this.toDto('description', source.invoiceTypeOnList);
            this.supplierNameDto = this.toDto('name', source.supplierName);
            this.supplierSiteNameDto = this.toDto('name', source.supplierSiteName);
            this.receivingDeptNameDto = this.toDto('fullName', source.receivingDeptName);
            this.poCodeDto = this.toDto('code', source.poCode);
            this.waybillNumberDto = this.toDto('waybillNumber', source.waybillNumber);
            this.fullNameDto = this.toDto('fullName', source.fullName);
            this.invoiceExportedNoDto = this.toDto('code', source.invoiceExportedNo);
            this.projectCodeDto = this.toDto('code', source.projectCode);
            this.ouNameDto = this.toDto('code', source.ouName);
            this.orgApplyNameDto = this.toDto('name', source.orgApplyName);
            this.taxTypeDto = this.toDto('description', source.taxType);
            this.currencyDto = this.toDto('name', source.currency);
            this.createdByInvoiceDto = this.toDto('fullName', source.fullName);
            this.paymentTermDto = this.toDto('name', source.paymentTerm);
        }
    }
}

