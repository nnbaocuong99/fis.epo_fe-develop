import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../../core/_base/component/base-form.component';
import { NotificationService } from '../../../../../../../services/common/notification/notification.service';
import { PaymentTermRequestPayload } from '../../../../../../../services/modules/category/payment-term/payment-term.request.payload';
import { PaymentTermService } from '../../../../../../../services/modules/category/payment-term/payment-term.service';
import { PurchaseOrderPaymentService } from '../../../../../../../services/modules/purchase-order-payment/purchase-order-payment.service';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from '../../purchase-order-edit.config';
import * as mainConfig from '../../../../../../../core/_config/main.config';
@Component({
    selector: 'app-purchase-order-payment-dialog',
    templateUrl: './purchase-order-payment-dialog.component.html',
    styleUrls: ['./purchase-order-payment-dialog.component.scss']
})
export class PurchaseOrderPaymentDialogComponent extends BaseFormComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() dialogRef: DialogRef;
    @Input() paymentTermData: any;
    @Output() success: EventEmitter<any> = new EventEmitter();
    public paymentTermRequestPayload = new PaymentTermRequestPayload();
    public headerPaymentTerm = config.HEADER_PAYMENT_TERM;
    public paymentType = config.PAYMENT_METHODS;
    public mainConfig = mainConfig.MAIN_CONFIG;

    constructor(
        public purchaseOrderPaymentService: PurchaseOrderPaymentService,
        public notification: NotificationService,
        public paymentTermService: PaymentTermService,
        public cdr: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit() {
        this.dialogRef.config.btnTitle = null;
        setTimeout(() => {
            this.dialogRef.input.rowData.paymentTermDto = this.toDto('name', this.dialogRef.input.rowData.paymentTerm);
        }, 0);
    }

    public onBtnSaveClick(): void {
        // tslint:disable-next-line:max-line-length
        if (this.dialogRef.input.rowData.totalRatio && (this.dialogRef.input.rowData.ratio > (100 - this.dialogRef.input.rowData.totalRatio))) {
            this.notification.showWarning('Tỷ lệ thanh toán không được lớn hơn ' + String((100 - this.dialogRef.input.rowData.totalRatio)));
            return;
        }

        // tslint:disable-next-line:max-line-length
        if (this.dialogRef.input.rowData.amount && ((this.dialogRef.input.rowData.amount + this.dialogRef.input.rowData.totalAmountMilestone) > this.dialogRef.input.rowData.totalAmount)) {
            // tslint:disable-next-line:max-line-length
            this.notification.showWarning('Số tiền không được lớn hơn số tiền thanh toán còn lại của đơn hàng: ' + String((this.dialogRef.input.rowData.totalAmount - this.dialogRef.input.rowData.totalAmountMilestone)));
            return;
        }

        this.purchaseOrderPaymentService
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

    public onChangeMilestoneDate(event: any): void {
        const milestoneDate = event;
        if (this.dialogRef.input.rowData.paymentTerm && milestoneDate) {
            const paymentTermTemp = Number(this.dialogRef.input.rowData.paymentTerm.slice(0, -1));
            // get ngày thanh toán
            const temp = new Date(milestoneDate);
            const dateTemp = new Date(temp.setDate(temp.getDate() + paymentTermTemp));
            this.dialogRef.input.rowData.paymentDate = dateTemp;
        }
    }

    public onChangePaymentTerm(paymentTermDto?: any): void {
        if (paymentTermDto) {
            this.dialogRef.input.rowData.paymentTerm = paymentTermDto.name;
        }
        if (this.dialogRef.input.rowData.paymentTerm && this.dialogRef.input.rowData.milestoneDate) {
            const paymentTermTemp = Number(this.dialogRef.input.rowData.paymentTerm.slice(0, -1));
            const temp = new Date(this.dialogRef.input.rowData.milestoneDate);
            const dateTemp = new Date(temp.setDate(temp.getDate() + paymentTermTemp));
            this.dialogRef.input.rowData.paymentDate = dateTemp;
            // get week
            // const onejan = new Date(dateTemp.getFullYear(), 0, 1);
            // const millisecsInDay = 86400000;
            // const week = Math.ceil((((dateTemp.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay() + 1) / 7);
            // this.dialogRef.input.rowData.dueWeek = week;
        }
    }

    public onChangeRatio(event: any): void {
        if (event) {
            const ratio = event.target.value;
            if (this.dialogRef.input.rowData.totalRatio && (ratio > (100 - this.dialogRef.input.rowData.totalRatio))) {
                // tslint:disable-next-line:max-line-length
                this.notification.showWarning('Tỷ lệ thanh toán không được lớn hơn ' + String((100 - this.dialogRef.input.rowData.totalRatio)));
                return;
            } else {
                if (ratio) {
                    if (ratio > 100) {
                        this.dialogRef.input.rowData.ratio = 100;
                    }
                    if (ratio < 0) {
                        this.dialogRef.input.rowData.ratio = 0;
                    }
                    if (this.dialogRef.input.rowData.totalAmount) {
                        // tslint:disable-next-line:max-line-length
                        this.dialogRef.input.rowData.amount = (this.dialogRef.input.rowData.totalAmount * this.dialogRef.input.rowData.ratio) / 100;
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
            if ((amount + this.dialogRef.input.rowData.totalAmountMilestone) <= this.dialogRef.input.rowData.totalAmount) {
                this.dialogRef.input.rowData.amount = amount;
            } else {
                // tslint:disable-next-line:max-line-length
                this.notification.showWarning('Số tiền không được lớn hơn số tiền thanh toán còn lại của đơn hàng: ' + String((this.dialogRef.input.rowData.totalAmount - this.dialogRef.input.rowData.totalAmountMilestone)));
                return;
            }
        }

    }
}
