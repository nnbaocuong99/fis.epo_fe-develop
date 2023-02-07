import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'label' })
export class LabelPipe implements PipeTransform {
    transform(value: any, source: any[], bindValue?: string, bindLabel?: string): string {
        if (bindValue == null || bindValue === undefined || bindValue === '') {
            bindValue = 'value';
        }

        if (bindLabel == null || bindLabel === undefined || bindLabel === '') {
            bindLabel = 'label';
        }

        if (source) {
            const item = source.filter(x => this.validValue(x[bindValue], value))[0];
            return item ? item[bindLabel] : '';
        } else {
            return value;
        }
    }

    private validValue(sourceValue: any, value: any): boolean {
        if (Array.isArray(sourceValue)) {
            return sourceValue.some(x => x === value);
        } else {
            return sourceValue === value;
        }
    }
}
