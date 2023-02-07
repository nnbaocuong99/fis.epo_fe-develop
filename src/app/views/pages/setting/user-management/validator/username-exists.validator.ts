import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { UserRequestPayload } from '../../../../../services/modules/user/user-request.payload';
import { UserService } from '../../../../../services/modules/user/user.service';

export const PERIOD_VALIDATOR_USERNAME: Provider = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => UserNameExistsValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[userNameExistValidator][ngModel]',
    providers: [
        PERIOD_VALIDATOR_USERNAME
    ]
})

export class UserNameExistsValidatorDirective implements AsyncValidator {
    @Input() id: string;
    constructor(
        private userService: UserService
    ) { }
    validate(control: FormControl) {
        const request = new UserRequestPayload();
        request.id = this.id;
        request.userName = control.value;
        return this.userService.checkUserNameExist(request, false).pipe(map(response => {
            if (response) {
                return { ALREADY_EXISTS: true };
            } else {
                return null;
            }
        }));
    }
}
