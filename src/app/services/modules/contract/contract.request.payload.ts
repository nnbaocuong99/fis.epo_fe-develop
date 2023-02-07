import { RequestPayload } from '../../common/http/request-payload.model';

export class EContractRequestPayload extends RequestPayload {
    pmAcc: string;
    eqAccountingCode: string;
    accountingCode: string;
    contractNumber: string;
}

export class EContractResponseDto {
    pageSize: number;
    totalRecords: number;
    records: any[];
    resultCode: string;
    message: string;
}

export class ContractRequestPayload extends RequestPayload {
    accountingCode: string;
}
