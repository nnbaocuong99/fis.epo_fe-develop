import { DatePipe, formatDate } from '@angular/common';
import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';

export const RESPONSE_DATE_VALUE_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ResponseDateValueValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[responseDateValueValidator]',
    providers: [
        RESPONSE_DATE_VALUE_VALIDATOR
    ]
})

/**
 * Validate period value inputed in format yyyymmdd
 */
export class ResponseDateValueValidatorDirective implements Validator {
    @Input() expectedDateRequest: any;
    constructor(private route: ActivatedRoute) { }
    validate(control: FormControl) {
        const value = control.value;
        if (value) {
            const responseDateValue =  _moment(new Date(value), 'yyyy-MM-dd').toDate();

            let expectedDateValue = null;

            let valueCheck = this.expectedDateRequest ? this.expectedDateRequest : control.parent.value.expectedDate;
            valueCheck =  _moment(valueCheck).format('YYYY-MM-DD');
            if (valueCheck) {
                expectedDateValue = _moment(new Date(valueCheck.toString()), 'YYYY-MM-DD').toDate();
            }
            const now = _moment(new Date(), 'dd/MM/yyyy').toDate();

            if (expectedDateValue &&
                (_moment(expectedDateValue, 'dd/MM/yyyy').subtract(5, 'days').toDate() > responseDateValue
                    || responseDateValue > expectedDateValue)
            ) {
                return { msgResponseDateError: true };
            } else {
                return null;
            }
            // this.route.params.subscribe(params => {
            //     if (params.id) {
            //         if (responseDateValue < now) {
            //             // In case value < now
            //             return { msgDatePastError: true };
            //         } else {
            //             return null;
            //         }
            //     } else {
            //         return null;
            //     }
            // });
        } else {
            return { msgResponseDateError: true };
        }
    }
}
