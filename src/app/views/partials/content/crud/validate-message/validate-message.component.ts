import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'validate-message',
    templateUrl: './validate-message.component.html',
    styleUrls: [],
})

export class ValidateMessageComponent implements OnInit {
    @Input() form: NgForm;
    @Input() controlName: string;
    constructor() {
    }

    ngOnInit() {
    }

    isShowError(form: NgForm, controlName: string): boolean {
        if (!form || !form.form || !form.form.controls[controlName]) {
            return false;
        }
        return form.form.controls[controlName].errors && form.form.controls[controlName].touched;
    }

    getShowError(form: NgForm, controlName: string): string[] {
        if (!form || !form.form || !form.form.controls[controlName] || !form.form.controls[controlName].errors) {
            return [];
        }
        return Object.keys(form.form.controls[controlName].errors);
    }
}



