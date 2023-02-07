import { RequestPayload } from '../../common/http/request-payload.model';

export class ImportGoodsDto extends RequestPayload {
    waybillNumber: string;
    masterBillNo: string;
    billOfLadingDate: Date | string | null;
    declarationNumber: string;
    declarationDate: Date | string | null;
    smSupplier: string;
    poCode: string;
    code: string;
    date: Date | string | null;
    supplierName: string;
    id: string;
    createdBy: string;
    creatorName: string;
    creatorMail: string;
    importStatus: number | null;
    elimStatus: number | null;
}
