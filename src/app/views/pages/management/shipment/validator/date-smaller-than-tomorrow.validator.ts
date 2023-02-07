import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator, Validator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const PERIOD_VALIDATOR_DATE_SMALLER_THAN_TOMORROW: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => DateSmallerThanTomorrowValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[dateSmallerThanTomorrow][ngModel]',
    providers: [
        PERIOD_VALIDATOR_DATE_SMALLER_THAN_TOMORROW
    ]
})

export class DateSmallerThanTomorrowValidatorDirective implements Validator {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) { }
    validate(control: FormControl) {
        console.log(control.value);
        if (control.value) {
            return { INVALID: true };
        } else {
            return null;
        }
    }
}
