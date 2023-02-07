export class PurchasePlanDto {
    code: string;
    amAccount: string;
    pmAccount: string;
    ceoCoo: string;
    projectCode: string;
    itemCode: string;
    supplierName: string;
    currency: string;
    expectedDate: Date;

    amAccountItems: string[];
    pmAccountItems: string[];
    ceoCooItems: string[];
    projectCodeDto: any;
    itemCodeDto: any;
    supplierNameDto: any;
    currencyDto: any;
    producerNameDto: any;

    constructor(model?: any) {
        if (model) {
            Object.assign(this, model);
            this.code = model.code;
            this.amAccountItems = model.amAccount ? model.amAccount.split(',') : [];
            this.pmAccountItems = model.amAccount ? model.amAccount.split(',') : [];
            this.ceoCooItems = model.ceoCoo ? model.ceoCoo.split(',') : [];
            this.projectCodeDto = model.projectCode ? { code: model.projectCode } : null;
            this.itemCodeDto = model.itemCode ? { code: model.itemCode } : null;
            this.supplierNameDto = model.supplierName ? { name: model.supplierName } : null;
            this.currencyDto = model.currency ? { code: model.currency } : null;
            this.expectedDate = model.expectedDate ? new Date(model.expectedDate) : null;
            this.producerNameDto = model.producerName ? { name: model.producerName } : null;
        }
    }
}
