import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PurchaseOrderRequestPayload } from '../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';

export const PERIOD_VALIDATOR_PO_CODE: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => CheckInvalidOrgApplyValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[checkInvalidOrgApply][ngModel]',
    providers: [
        PERIOD_VALIDATOR_PO_CODE
    ]
})

export class CheckInvalidOrgApplyValidatorDirective implements AsyncValidator {
    @Input() ouId: string;
    @Input() subDepartmentId: string;

    constructor(
        private purchaseOrderService: PurchaseOrderService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }
    validate(control: FormControl) {
        const request = new PurchaseOrderRequestPayload();
        request.ouId = this.ouId;
        request.subDepartmentId = this.subDepartmentId;
        return this.purchaseOrderService.checkInvalidOrgApply(request).pipe(map(response => {
            if (response) {
                return { NOT_IN_THE_LEGAL: true };
            } else {
                return null;
            }
        }));
    }
}
