import { DatePipe, formatDate } from '@angular/common';
import { Provider, forwardRef, Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';

export const DATE_PAST_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DatePastValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[datePastValidator]',
    providers: [
        DATE_PAST_VALIDATOR
    ]
})

/**
 * Validate period value inputed in format yyyymmdd
 */
export class DatePastValidatorDirective implements Validator {
    constructor(private route: ActivatedRoute) { }
    validate(control: FormControl) {
        const value = control.value;
        if (value === null || value === undefined) {
            // In case user hasn't inputed
            return null;
        } else {
            this.route.params.subscribe(params => {
                if (params.id) {
                    const dateTimeValue = _moment(new Date(value.toString()), 'dd/MM/yyyy').toDate();
                    const now = _moment(new Date(), 'dd/MM/yyyy').toDate();
                    if (dateTimeValue < now) {
                        // In case value < now
                        return { msgDatePastError: true };
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            });
        }
    }
}
