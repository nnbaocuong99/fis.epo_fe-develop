import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyMask' })
export class CurrencyMaskPipe implements PipeTransform {
    transform(value: string, currency: string): string {
        let result = '';
        if (currency === 'VND') {
            result = this.format(value, 0, 3, ',', '.');
        } else {
            result = this.format(value, 2, 3, ',', '.');
        }
        return result;
    }
    /**
     * Number.prototype.format(n, x, s, c)
     *
     * @param integer n: length of decimal
     * @param integer x: length of whole part
     * @param mixed   s: sections delimiter
     * @param mixed   c: decimal delimiter
     */
    private format(value: any, n: any, x: any, s: any, c: any) {
        let result = '';
        if (value != null && value !== undefined) {
            if (typeof (value) === 'string') {
                value = parseFloat(value);
            }
            const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
            const num = value.toFixed(Math.max(0, n));
            result = (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
        }
        return result;
    }
}
