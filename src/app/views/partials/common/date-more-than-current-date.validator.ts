import { DatePipe, formatDate } from '@angular/common';
import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';

export const DATE_MORE_THAN_CURRENT_DATE_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DateMoreThanCurrentDateValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[dateMoreThanCurrentDateValidator]',
    providers: [
        DATE_MORE_THAN_CURRENT_DATE_VALIDATOR
    ]
})

/**
 * Validate quantity
 */
export class DateMoreThanCurrentDateValidatorDirective implements Validator {
    constructor() { }
    validate(control: FormControl) {
        if (control.value) {
            const a = _moment(new Date(control.value), 'yyyy-MM-dd').toDate();
            const b = _moment(new Date(), 'yyyy-MM-dd').toDate();
            if (this.compareDate(a, b) < 0) {
                return { INVALID: true };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public compareDate(date1: Date, date2: Date): number {
        date1.setHours(0);
        date1.setMinutes(0);
        date1.setSeconds(0);
        date1.setMilliseconds(0);
        date2.setHours(0);
        date2.setMinutes(0);
        date2.setSeconds(0);
        date2.setMilliseconds(0);
        if (_moment(date1).isAfter(date2)) {
            return 1;
        }
        if (_moment(date1).isSame(date2)) {
            return 0;
        }
        if (_moment(date1).isBefore(date2)) {
            return -1;
        }
    }
}
