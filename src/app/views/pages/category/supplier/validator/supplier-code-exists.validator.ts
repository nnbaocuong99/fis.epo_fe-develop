import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { SupplierRequestPayload } from '../../../../../services/modules/category/supplier/supplier.request.payload';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';

export const PERIOD_VALIDATOR_SUPPLIER_CODE: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => SupplierCodeExistsValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[supplierCodeExistValidator][ngModel]',
    providers: [
        PERIOD_VALIDATOR_SUPPLIER_CODE
    ]
})

export class SupplierCodeExistsValidatorDirective implements AsyncValidator {
    @Input() id: string;
    constructor(
        private userService: SupplierService
    ) { }
    validate(control: FormControl) {
        const request = new SupplierRequestPayload();
        request.id = this.id;
        request.code = control.value;
        return this.userService.checkCodeExist(request, false).pipe(map(response => {
            if (response) {
                return { ALREADY_EXISTS: true };
            } else {
                return null;
            }
        }));
    }
}
