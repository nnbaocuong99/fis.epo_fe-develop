import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { BrandRequestPayload } from '../../../../../services/modules/category/brand/brand.request.payload';
import { BrandService } from '../../../../../services/modules/category/brand/brand.service';

export const PERIOD_VALIDATOR_BRAND_CODE: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => BrandCodeExistsValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[brandCodeExistValidator][ngModel]',
    providers: [
        PERIOD_VALIDATOR_BRAND_CODE
    ]
})

export class BrandCodeExistsValidatorDirective implements AsyncValidator {
    @Input() id: string;
    constructor(
        private userService: BrandService
    ) { }
    validate(control: FormControl) {
        const request = new BrandRequestPayload();
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
