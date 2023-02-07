import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { SupplierRequestPayload } from '../../../../../services/modules/category/supplier/supplier.request.payload';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';

export const PERIOD_VALIDATOR_SUPPLIER_EMAIL: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => SupplierEmailExistsValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[supplierEmailExistValidator][ngModel]',
    providers: [
        PERIOD_VALIDATOR_SUPPLIER_EMAIL
    ]
})

export class SupplierEmailExistsValidatorDirective implements AsyncValidator {
    @Input() id: string;
    constructor(
        private userService: SupplierService
    ) { }
    validate(control: FormControl) {
        const request = new SupplierRequestPayload();
        request.id = this.id;
        request.email = control.value;
        return this.userService.checkEmailExist(request, false).pipe(map(response => {
            if (response) {
                return { ALREADY_EXISTS: true };
            } else {
                return null;
            }
        }));
    }
}
