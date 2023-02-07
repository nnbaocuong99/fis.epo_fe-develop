import { DatePipe, formatDate } from '@angular/common';
import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';

export const QUANTITY_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => QuantityValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[quantityValidator]',
    providers: [
        QUANTITY_VALIDATOR
    ]
})

/**
 * Validate quantity
 */
export class QuantityValidatorDirective implements Validator {
    @Input() viewFromAppendix: false;
    @Input() rowData: any;
    constructor() { }
    validate(control: FormControl) {
        if (this.viewFromAppendix) {
            return null;
        }
        const value = control.value;
        if ((!this.rowData.currentPoId && (value > this.rowData.quantityRemain))
            // điều kiện form sửa
            || (this.rowData.currentPoId && (this.rowData.priQuantityRemain < value - this.rowData.quantityOrigin))) {
            return { msgQuantityError: true };
        } else if (this.rowData.currentPoId && (value < this.rowData.quantityOrigin - this.rowData.quantityRemain)) {
            return { msgOverPiQuantity: true };
        } else {
            return null;
        }
    }
}
