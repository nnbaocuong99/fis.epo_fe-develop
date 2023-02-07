import { Provider, forwardRef, Directive } from '@angular/core';
import { FormControl, AsyncValidator, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { PurchaseOrderItemRequestPayload } from '../../../../../services/modules/purchase-order-item/purchase-order-item.request-payload';
import { PurchasePlanItemService } from '../../../../../services/modules/purchase-plan-item/purchase-plan-item.service';

export const PERIOD_VALIDATOR_INDEX_NO_PPI: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => IndexNoPurchasePlanItemValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[indexNoPurchasePlanItemValidator][ngModel]',
    providers: [
        PERIOD_VALIDATOR_INDEX_NO_PPI
    ]
})

export class IndexNoPurchasePlanItemValidatorDirective implements AsyncValidator {
    constructor(
        private purchasePlanItemService: PurchasePlanItemService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }
    validate(control: FormControl) {
        const parent = control.parent;

        const id = parent.controls['id'] ? parent.controls['id'].value : null;
        const poId = parent.controls['ppId'] ? parent.controls['ppId'].value : null;

        const request = new PurchaseOrderItemRequestPayload();
        request.id = id;
        request.poId = poId;
        request.indexNo = control.value;

        return this.purchasePlanItemService.checkIndexNoExists(request).pipe(map(response => {
            if (response) {
                return { ALREADY_EXISTS: true };
            } else {
                if (this.checkInvalid(control.value)) {
                    return { INVALID: true };
                } else {
                    return null;
                }
            }
        }));
    }

    checkInvalid(value: string) {
        let check = false;
        if (value && value.length > 0) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < value.length; i++) {
                if (i === 0) {
                    if (value[i] === '.') {
                        check = true;
                    }
                } else {
                    if (i === value.length - 1) {
                        if (value[i] === '.') {
                            check = true;
                        }
                    }
                    if ((value[i] < '0' || value[i] > '9') && value[i] !== '.') {
                        check = true;
                    }
                    if (value[i] === '.' && value[i - 1] === '.') {
                        check = true;
                    }
                }
            }
        }
        return check;
    }
}
