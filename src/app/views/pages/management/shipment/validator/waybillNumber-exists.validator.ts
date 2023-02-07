import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ShipmentRequestPayload } from '../../../../../services/modules/shipment/shipment.request-payload';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';

// tslint:disable-next-line:variable-name
export const PERIOD_VALIDATOR_WaybillNumber: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => WaybillNumberExistsValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[waybillNumberExistValidator][ngModel]',
    providers: [
        PERIOD_VALIDATOR_WaybillNumber
    ]
})

export class WaybillNumberExistsValidatorDirective implements AsyncValidator {
    @Input() id: string;
    constructor(
        private shipmentService: ShipmentService
    ) { }
    validate(control: FormControl) {
        const request = new ShipmentRequestPayload();
        request.shipmentId = this.id;
        request.waybillNumber = control.value;
        return this.shipmentService.checkShipmentExist(request, false).pipe(map(response => {
            if (response) {
                return { ALREADY_EXISTS: true };
            } else {
                return null;
            }
        }));
    }
}
