import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { PurchaseOrderRequestPayload } from '../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';

export const PERIOD_VALIDATOR_PO_CODE: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => CodeExistsValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[codeExistValidator][ngModel]',
    providers: [
        PERIOD_VALIDATOR_PO_CODE
    ]
})

export class CodeExistsValidatorDirective implements AsyncValidator {
    @Input() id: string;
    constructor(
        private purchaseOrderService: PurchaseOrderService
    ) { }
    validate(control: FormControl) {
        const request = new PurchaseOrderRequestPayload();
        request.poId = this.id;
        request.code = control.value;
        return this.purchaseOrderService.checkCodeExist(request, false).pipe(map(response => {
            if (response) {
                return { ALREADY_EXISTS: true };
            } else {
                return null;
            }
        }));
    }
}
