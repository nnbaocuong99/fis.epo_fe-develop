import { RequestPayload } from '../../../common/http/request-payload.model';

export class ExchangeRateRequestPayload extends RequestPayload {
    type: string;
    date: any;
    currencyFrom: string;
    currencyTo: string;
    generalFilter: string;
}
