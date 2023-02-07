import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { PurchaseRequestItemRequestPayload } from '../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import { PurchaseRequestItemService } from '../../../../../services/modules/purchase-request-item/purchase-request-item.service';

export const PERIOD_VALIDATOR_IPO_NUMBER: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => IpoNumberExistsValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[ipoNumberExistValidator][ngModel]',
    providers: [
        PERIOD_VALIDATOR_IPO_NUMBER
    ]
})

export class IpoNumberExistsValidatorDirective implements AsyncValidator {
    @Input() id: string;
    @Input() otherIpo: string;
    constructor(
        private purchaseRequestItemService: PurchaseRequestItemService
    ) { }
    validate(control: FormControl) {
        const request = new PurchaseRequestItemRequestPayload();
        request.ipoNumber = control.value;
        return this.purchaseRequestItemService.checkIpoNumberExist(request, false).pipe(map(response => {
            if (control.value && this.otherIpo
                && control.value.toLowerCase().toString().trim() === this.otherIpo.toLowerCase().toString().trim()) {
                return { ALREADY_EXISTS: true };
            }
            if (response) {
                return { ALREADY_EXISTS: true };
            } else {
                return null;
            }
        }));
    }
}
