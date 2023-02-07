import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

export const VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CheckDuplicateDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[checkDuplicate]',
    providers: [
        VALIDATOR
    ]
})

/**
 * Validate period value inputed in format yyyymmdd
 */
export class CheckDuplicateDirective implements Validator {
    @Input() checkDuplicateSource: any[];
    constructor() { }
    validate(control: FormControl) {
        const value = control.value;
        if (value === null || value === undefined) {
            // In case user hasn't inputed
            return null;
        } else {
            if (this.checkDuplicateSource.some(x => x === value.toString())) {
                return { duplicateIndexNo: true };
            } else {
                return null;
            }
        }
    }
}
