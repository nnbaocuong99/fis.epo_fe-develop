import { DecimalPipe } from '@angular/common';
import { Provider, forwardRef, Directive, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';

export const DATE_PAST_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NumberMaskValidatorDirective),
    multi: true
};

@Directive({
    selector: '[numberMask]',
    providers: [
        DATE_PAST_VALIDATOR
    ]
})

/**
 * Validate period value inputed in format yyyymmdd
 */
export class NumberMaskValidatorDirective implements Validator {
    @Input() allowNegative: boolean = false;
    @Input() decimal: number = 9; // cho phép nhập 9 số thập phân sau dấu ,

    constructor(
        public ele: ElementRef) { }
    validate(control: FormControl) {
        const regex = /,/g;
        const pipe = new DecimalPipe('en-US');
        this.ele.nativeElement.onkeydown = (event: KeyboardEvent) => {
            const scope = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '.', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Backspace', 'Delete', 'Enter'];

            if (scope.indexOf(event.key) === -1 && !event.ctrlKey && !event.shiftKey) {
                event.preventDefault();
            }

            if (event.key === '.') {
                if (this.ele.nativeElement.value === '' || (this.ele.nativeElement.value.match(/[.]/g) || []).length >= 1) {
                    event.preventDefault();
                }
            }

            if (this.allowNegative && event.key === '-') {
                if (this.ele.nativeElement.value === '' || (this.ele.nativeElement.value.match(/-/g) || []).length >= 1) {
                    event.preventDefault();
                } else if ((this.ele.nativeElement.value.match(/-/g) || []).length === 0) {
                    event.preventDefault();
                    this.ele.nativeElement.value = '-' + this.ele.nativeElement.value;
                }
            } else if (!this.allowNegative && event.key === '-') {
                event.preventDefault();
            }
        }

        this.ele.nativeElement.onblur = () => {
            if (control.value) {
                const index = control.value.toString().indexOf('.');
                if (index > -1) {
                    const parts = control.value.toString().split('.');
                    const decimal = parts[1];
                    if (decimal === '') {
                        this.ele.nativeElement.value = this.ele.nativeElement.value + '0'
                    } else {
                        this.ele.nativeElement.value = this.trimPadZero(this.ele.nativeElement.value);
                    }
                }
            }
        }

        this.ele.nativeElement.onfocus = () => {
            this.ele.nativeElement.select();
        }

        if (control.value) {
            try {
                const currentPos = this.ele.nativeElement.selectionStart;
                const numberPos = this.ele.nativeElement.value.slice(0, currentPos).replace(regex, '').toString().length;
                if (control.value.toString().indexOf('.') > -1) {
                    const parts = control.value.toString().split('.');
                    const whole = parts[0];
                    let decimal: string = parts[1];
                    if (decimal && decimal.length > this.decimal) {
                        decimal = decimal.slice(0, this.decimal);
                    }
                    if (pipe.transform(whole.replace(regex, '')) + '.' + decimal !== this.ele.nativeElement.value) {
                        this.ele.nativeElement.value = pipe.transform(whole.replace(regex, '')) + '.' + decimal;
                        const number = whole.replace(regex, '') + '.' + decimal;
                        control.setValue(parseFloat(number), { emitModelToViewChange: false, emitViewToModelChange: false });
                        const stringPos = this.findStringPosition(this.ele.nativeElement.value, numberPos);
                        this.ele.nativeElement.setSelectionRange(stringPos, stringPos);
                    }
                } else if (pipe.transform(control.value.toString().replace(regex, '')) !== this.ele.nativeElement.value) {
                    if (this.ele.nativeElement.value.indexOf('.') === -1) {
                        this.ele.nativeElement.value = pipe.transform(control.value.toString().replace(regex, ''));
                        const number = control.value.toString().replace(regex, '');
                        control.setValue(parseFloat(number), { emitModelToViewChange: false, emitViewToModelChange: false });
                        const stringPos = this.findStringPosition(this.ele.nativeElement.value, numberPos);
                        this.ele.nativeElement.setSelectionRange(stringPos, stringPos);
                    }
                }

                if (typeof (control.value) === 'string') {
                    const currentText = control.value;
                    control.setValue(parseFloat(control.value.replace(regex, '')), { emitEvent: false, emitModelToViewChange: false, emitViewToModelChange: false });
                    this.ele.nativeElement.value = currentText;
                }
            } catch {
                control.setValue(null);
            }
        }

        return null;
    }

    private findStringPosition(source: string, numPos: number): number {
        let num = 0;
        let str = 0;
        for (let char of source) {
            str++;
            if (!isNaN(char as any)) {
                num++;
                if (num === numPos) {
                    return str;
                }
            }
        }

        return source.length;
    }

    private trimPadZero(source: string): string {
        if (source.indexOf('.') > -1) {
            const a = source.split('.');
            const decimal = a[1];
            let del = 0;
            for (let i = a[1].length - 1; i >= 0; i--) {
                if (a[1][i] === '0') {
                    del++;
                } else {
                    break;
                }
            }
            return a[0] + '.' + decimal.slice(0, decimal.length - del);
        }
    }
}

