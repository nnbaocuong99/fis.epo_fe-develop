import { DatePipe, formatDate } from '@angular/common';
import { Provider, forwardRef, Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';

export const CHECK_MAX_LENGTH_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CheckMaxLengthValidatorDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[checkMaxLengthValidator]',
    providers: [
        CHECK_MAX_LENGTH_VALIDATOR
    ]
})

/**
 * Validate quantity
 */
export class CheckMaxLengthValidatorDirective implements Validator {
    @Input() length: number = 240; // mặc định 240 ký tự (đếm cả dấu)
    @Input() checkLength: boolean = false;

    constructor() { }

    validate(control: FormControl) {
        if (control.value && this.checkLength) {
            if (!this.checkMaxLengthVietnamese(control.value.toString(), parseInt(this.length.toString()))) {
                return { INVALID: true };
            } else {
                return null;
            }
        }
        return null;
    }

    checkMaxLengthVietnamese(str: string, maxLength: number): boolean {
        if (!str) {
            return true;
        }
        const strCharacterVietnamese = 'áàạảãâấầậẩẫăắằặẳẵÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨđĐýỳỵỷỹÝỲỴỶỸ';
        let count = 0;
        for (let i = 0; i < str.length; i++) {
            count++;
            if (strCharacterVietnamese.includes(str[i])) {
                count++;
            }
            if (count > maxLength) {
                return false;
            }
        }
        return true;
    }
}
