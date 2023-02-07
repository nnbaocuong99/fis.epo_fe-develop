import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../../core/_base/component/base-form.component';
import * as mainConfig from '../../../../../../../core/_config/main.config';
import { NotificationService } from '../../../../../../../services/common/notification/notification.service';
import { PaymentTermRequestPayload } from '../../../../../../../services/modules/category/payment-term/payment-term.request.payload';
import { PaymentTermService } from '../../../../../../../services/modules/category/payment-term/payment-term.service';
import {
    PurchaseInvoicePaymentService
} from '../../../../../../../services/modules/purchase-invoice-payment/purchase-invoice-payment.service';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from '../../purchase-invoice-edit.config';

@Component({
    selector: 'app-purchase-invoice-payment-dialog',
    templateUrl: './purchase-invoice-payment-dialog.component.html',
    styleUrls: ['./purchase-invoice-payment-dialog.component.scss']
})
export class PurchaseInvoicePaymentDialogComponent extends BaseFormComponent
    implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() dialogRef: DialogRef;
    @Output() success: EventEmitter<any> = new EventEmitter();

    public statusPayments = config.STATUS_PAYMENT;
    public headerPaymentTerm = config.HEADER_PAYMENT_TERM;
    public mainConfig = mainConfig.MAIN_CONFIG;
    public paymentTermRequestPayload = new PaymentTermRequestPayload();

    constructor(
        public purchaseInvoicePaymentService: PurchaseInvoicePaymentService,
        public notification: NotificationService,
        public paymentTermService: PaymentTermService,
        public cdr: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit() {
        setTimeout(() => {
            this.dialogRef.config.btnTitle = null;
            this.dialogRef.input.rowData.paymentTermDto = this.toDto('name', this.dialogRef.input.rowData.paymentTerm);
        }, 0);
    }

    public onBtnSaveClick(): void {
        // tslint:disable-next-line:max-line-length
        if (this.dialogRef.input.rowData.totalExchangeRate && (this.dialogRef.input.rowData.exchangeRate > (100 - this.dialogRef.input.rowData.totalExchangeRate))) {
            // tslint:disable-next-line:max-line-length
            this.notification.showWarning('Tỷ lệ thanh toán không được lớn hơn ' + String((100 - this.dialogRef.input.rowData.totalExchangeRate)));
            return;
        }
        // tslint:disable-next-line:max-line-length
        if (Math.abs(this.dialogRef.input.rowData.amount) && (Math.abs((this.dialogRef.input.rowData.amount + this.dialogRef.input.rowData.totalAmountMilestone)) > Math.abs(this.dialogRef.input.rowData.totalAmount))) {
            // tslint:disable-next-line:max-line-length
            this.notification.showWarning('Số tiền không được lớn hơn số tiền thanh toán còn lại của hóa đơn: ' + String((this.dialogRef.input.rowData.totalAmount - this.dialogRef.input.rowData.totalAmountMilestone)));
            return;
        }
        // tslint:disable-next-line:max-line-length
        if (Math.abs(this.dialogRef.input.rowData.actualPaymentValue) && (Math.abs((this.dialogRef.input.rowData.actualPaymentValue + this.dialogRef.input.rowData.totalActualPaymentValueMilestone)) > Math.abs(this.dialogRef.input.rowData.totalAmount))) {
            // tslint:disable-next-line:max-line-length
            this.notification.showWarning('Số tiền không được lớn hơn số tiền thanh toán còn lại của hóa đơn: ' + String((this.dialogRef.input.rowData.totalAmount - this.dialogRef.input.rowData.totalActualPaymentValueMilestone)));
            return;
        }
        this.purchaseInvoicePaymentService
            .merge(this.dialogRef.input.rowData)
            .subscribe((res) => {
                this.notification.showSuccess();
                this.dialogRef.hide();
                this.success.emit(res);
            });
    }

    public onBtnCancelClick(): void {
        this.dialogRef.hide();
    }

    public onChangeBillingDate(event: any): void {
        if (event) {
            if (this.dialogRef.input.rowData.paymentTerm) {
                const paymentTermTemp = Number(this.dialogRef.input.rowData.paymentTerm.slice(0, -1));
                const temp = new Date(event);
                const dateTemp = new Date(temp.setDate(temp.getDate() + paymentTermTemp));
                // get date
                this.dialogRef.input.rowData.dueDate = dateTemp;
                // get week
                const onejan = new Date(dateTemp.getFullYear(), 0, 1);
                const millisecsInDay = 86400000;
                const week = Math.ceil((((dateTemp.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay() + 1) / 7);
                this.dialogRef.input.rowData.dueWeek = week;
            }
        }
    }

    public onChangePaymentTerm(paymentTermDto?: any): void {
        if (paymentTermDto) {
            this.dialogRef.input.rowData.paymentTerm = paymentTermDto.name;
            this.dialogRef.input.rowData.paymentTermDto = {
                name: this.dialogRef.input.rowData.paymentTerm
            };
        }
        if (this.dialogRef.input.rowData.billingDate && this.dialogRef.input.rowData.paymentTerm) {
            const paymentTerm = Number(this.dialogRef.input.rowData.paymentTerm.slice(0, -1));

            if (this.dialogRef.input.rowData.billingDate) {
                const temp = new Date(this.dialogRef.input.rowData.billingDate);
                const dateTemp = new Date(temp.setDate(temp.getDate() + paymentTerm));
                this.dialogRef.input.rowData.dueDate = dateTemp;
                // get week
                const onejan = new Date(dateTemp.getFullYear(), 0, 1);
                const millisecsInDay = 86400000;
                const week = Math.ceil((((dateTemp.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay() + 1) / 7);
                this.dialogRef.input.rowData.dueWeek = week;
            }
        }
    }

    public onChangeExchangeRate(event: any): void {
        if (event) {
            const exchangeRate = event.target.value;
            if (this.dialogRef.input.rowData.totalExchangeRate && (exchangeRate > (100 - this.dialogRef.input.rowData.totalExchangeRate))) {
                // tslint:disable-next-line:max-line-length
                this.notification.showWarning('Tỷ lệ thanh toán không được lớn hơn ' + String((100 - this.dialogRef.input.rowData.totalExchangeRate)));
                return;
            } else {
                if (exchangeRate) {
                    this.dialogRef.input.rowData.exchangeRate = exchangeRate;
                    if (exchangeRate > 100) {
                        this.dialogRef.input.rowData.exchangeRate = 100;
                    }
                    if (exchangeRate < 0) {
                        this.dialogRef.input.rowData.exchangeRate = 0;
                    }
                    if (this.dialogRef.input.rowData.totalAmount) {
                        // tslint:disable-next-line:max-line-length
                        this.dialogRef.input.rowData.amount = (this.dialogRef.input.rowData.totalAmount * this.dialogRef.input.rowData.exchangeRate) / 100;
                    }
                } else {
                    this.dialogRef.input.rowData.amount = null;
                }
            }
        }
    }

    public onChangeAmount(event: any) {
        if (event) {
            const amount = event;
            // tslint:disable-next-line:max-line-length
            if (Math.abs((amount + this.dialogRef.input.rowData.totalAmountMilestone)) <= Math.abs(this.dialogRef.input.rowData.totalAmount)) {
                this.dialogRef.input.rowData.amount = amount;
            } else {
                // tslint:disable-next-line:max-line-length
                this.notification.showWarning('Số tiền không được lớn hơn số tiền thanh toán còn lại của hóa đơn: ' + String((this.dialogRef.input.rowData.totalAmount - this.dialogRef.input.rowData.totalAmountMilestone)));
                return;
            }
        }
    }

    public onChangeActualPaymentValue(event: any) {
        if (event) {
            const actualPaymentValue = event + this.dialogRef.input.rowData.totalActualPaymentValueMilestone;
            if (Math.abs(actualPaymentValue) <= Math.abs(this.dialogRef.input.rowData.totalAmount)) {
                this.dialogRef.input.rowData.actualPaymentValue = actualPaymentValue;
            } else {
                this.notification.showWarning('Số tiền không được lớn hơn số tiền thanh toán còn lại của hóa đơn: '
                    + String((this.dialogRef.input.rowData.totalAmount - this.dialogRef.input.rowData.totalActualPaymentValueMilestone)));
                return;
            }
            if (Math.abs(actualPaymentValue) < Math.abs(this.dialogRef.input.rowData.amount)) {
                this.dialogRef.input.rowData.status = this.statusPayments[1].value;
            } else {
                this.dialogRef.input.rowData.status = this.statusPayments[2].value;

            }
            this.detectChanges();
        }
    }

    private detectChanges(): void {
        if (this.cdr && !this.cdr[`destroyed`]) {
            this.cdr.detectChanges();
        }
    }
}
