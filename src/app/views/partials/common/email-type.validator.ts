import { DatePipe, formatDate } from '@angular/common';
import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';

export const EMAIL_TYPE_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EmailTypeValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[emailTypeValidator]',
    providers: [
        EMAIL_TYPE_VALIDATOR
    ]
})

/**
 * Validate quantity
 */
export class EmailTypeValidatorDirective implements Validator {
    constructor() { }
    validate(control: FormControl) {
        if (control.value) {
            const arrTemp = control.value.split(',');
            let check = true;
            for (const item of arrTemp) {
                if (!this.validateEmail(item.trim())) {
                    check = false;
                }
            }
            if (check) {
                return null;
            } else {
                return { EMAIL_FORMAT: true };
            }
        } else {
            return null;
        }
    }

    private validateEmail(email): any {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}
