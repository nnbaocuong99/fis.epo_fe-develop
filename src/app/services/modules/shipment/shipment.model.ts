import { BaseResponse } from "../../common/http/base-response.model";

export class ShipmentDto extends BaseResponse {
    billOfLadingDate: Date;
    receiptDate: Date;
    expectedFromDate: Date;
    actualFromDate: Date;
    physicalInventoryDate: Date;
    expectedToDate: Date;
    actualToDate: Date;
    coOriginDate: Date;
    coOrginLoanDate: Date;
    coOriginExpectedDate: Date;
    coOriginActualDate: Date;
    declarationDate: Date;
    declarationClearanceDate: Date;

    constructor(model?: any) {
        super(model);
        if (model) {
            this.billOfLadingDate = this.toDate(this.billOfLadingDate);
            this.receiptDate = this.toDate(this.receiptDate);
            this.expectedFromDate = this.toDate(this.expectedFromDate);
            this.actualFromDate = this.toDate(this.actualFromDate);
            this.physicalInventoryDate = this.toDate(this.physicalInventoryDate);
            this.expectedToDate = this.toDate(this.expectedToDate);
            this.actualToDate = this.toDate(this.actualToDate);
            this.coOriginDate = this.toDate(this.coOriginDate);
            this.coOrginLoanDate = this.toDate(this.coOrginLoanDate);
            this.coOriginExpectedDate = this.toDate(this.coOriginExpectedDate);
            this.coOriginActualDate = this.toDate(this.coOriginActualDate);
            this.declarationDate = this.toDate(this.declarationDate);
            this.declarationClearanceDate = this.toDate(this.declarationClearanceDate);
        }
    }
}
