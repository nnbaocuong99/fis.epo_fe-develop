import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyMaskNotDecimal' })
export class CurrencyMaskNotDecimalPipe implements PipeTransform {
    transform(value: string): string {
        let result: any = null;
        if (value) {
            result = Math.round(parseFloat(value));
        }
        return result;
    }
}
