import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from '../purchase-invoice-edit.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { DeleteConfirmation } from '../../../../../../services/common/confirmation/delete-confirmation';
import {
    PurchaseInvoicePaymentService
} from '../../../../../../services/modules/purchase-invoice-payment/purchase-invoice-payment.service';
import {
    PurchaseInvoicePaymentRequestPayload
} from '../../../../../../services/modules/purchase-invoice-payment/purchase-invoice-payment.request-payload';
import { BaseListComponent } from '../../../../../../core/_base/component/base-list.component';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';

@Component({
    selector: 'app-purchase-invoice-payment',
    templateUrl: './purchase-invoice-payment.component.html',
    styleUrls: ['./purchase-invoice-payment.component.scss']
})
export class PurchaseInvoicePaymentComponent extends BaseListComponent implements OnInit {
    @Input() purchaseInvoiceData: any;
    @Input() viewMode = false;

    public mainConfig: any;
    public request: any;
    public purchaseInvoicePaymentData: any = {};
    public dialogRef: DialogRef = new DialogRef();
    public statusPayments = config.STATUS_PAYMENT;
    public headers = config.HEADER_PAYMENT;
    public isShowPaymentDialog = false;
    public totalExchangeRate = 0;
    public totalAmountMilestone = 0;
    public totalActualPaymentValueMilestone = 0;

    constructor(
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        public purchaseInvoiceService: PurchaseInvoiceService,
        public purchaseInvoicePaymentService: PurchaseInvoicePaymentService
    ) {
        super();
    }

    ngOnInit() {
        this.baseService = this.purchaseInvoicePaymentService;
        this.request = new PurchaseInvoicePaymentRequestPayload();
        this.mainConfig = mainConfig.MAIN_CONFIG;

        const routeSub = this.route.params.subscribe(params => {
            if (params.id) {
                this.request.piId = params.id;
                this.initDataPiPayment();
                this.pagingData();
                this.purchaseInvoiceService.selectById(params.id).subscribe(res => {
                    this.purchaseInvoicePaymentData = res;
                    this.cdr.detectChanges();
                    // super.ngOnInit();
                });
            }
        });
        this.subscriptions.push(routeSub);
    }

    public initDataPiPayment(): void {
        this.initData();
        this.fnSuccess = () => {
            if (this.dataSource.items && this.dataSource.items.length > 0) {
                // T???ng t??? l??? thanh to??n (%)
                let totalExchangeRate = 0;
                // T???ng ti???n c??c m???c thanh to??n (%)
                let totalAmountMilestone = 0;
                // T???ng ti???n thanh to??n th???c t??? c??c m???c thanh to??n (%)
                let totalActualPaymentValueMilestone = 0;

                for (const element of this.dataSource.items) {
                    if (element.exchangeRate) {
                        totalExchangeRate += +element.exchangeRate;
                    }
                    if (element.amount) {
                        totalAmountMilestone += +element.amount;
                    }
                    if (element.actualPaymentValue) {
                        totalActualPaymentValueMilestone += +element.actualPaymentValue;
                    }
                }
                // T???ng t??? l??? thanh to??n (%)
                this.totalExchangeRate = totalExchangeRate;
                // T???ng t??? l??? thanh to??n (%)
                this.totalAmountMilestone = totalAmountMilestone;
                // T???ng ti???n thanh to??n th???c t??? c??c m???c thanh to??n (%)
                this.totalActualPaymentValueMilestone = totalActualPaymentValueMilestone;
                this.cdr.detectChanges();
            }
        };
    }

    public onSuccess(data: any): any {
        this.initDataPiPayment();
        this.cdr.detectChanges();
    }

    public onBtnAddClick(): void {
        const totalAmount = Math.abs(this.purchaseInvoiceData.totalAmount);
        const totalAmountMilestone = Math.abs(this.totalAmountMilestone);
        const totalActualPaymentValueMilestone = Math.abs(this.totalActualPaymentValueMilestone);

        if (totalAmount && this.totalExchangeRate < 100 &&
            totalAmountMilestone < totalAmount && totalActualPaymentValueMilestone < totalAmount) {
            this.isShowPaymentDialog = false;
            this.cdr.detectChanges();
            const params = {
                rowData: {
                    piId: this.request.piId,
                    billingDate: this.purchaseInvoiceData.date,
                    totalAmount: this.purchaseInvoiceData.totalAmount,
                    paymentTerm: this.purchaseInvoiceData.paymentTerm,
                    totalAmountMilestone: this.totalAmountMilestone,
                    totalActualPaymentValueMilestone: this.totalActualPaymentValueMilestone,
                    totalExchangeRate: this.totalExchangeRate,
                    status: this.statusPayments[1].value // ??ang thanh to??n
                }
            };
            this.dialogRef.input = params;
            this.dialogRef.config.style = { width: '60vw' };
            this.dialogRef.config.title = 'Th??m th??ng tin thanh to??n';
            this.isShowPaymentDialog = true;
            this.dialogRef.show();
            this.cdr.detectChanges();
        } else {
            if (this.totalExchangeRate === 100) {
                // tslint:disable-next-line:max-line-length
                this.notification.showWarning('Kh??ng th??? th??m th??ng tin thanh to??n do t???ng t??? l??? thanh to??n c??c m???c l?? ' + String(this.totalExchangeRate) + '%');
                return;
            }
            if (this.totalAmountMilestone === this.purchaseInvoiceData.totalAmount) {
                // tslint:disable-next-line:max-line-length
                this.notification.showWarning('Kh??ng th??? th??m th??ng tin thanh to??n do t???ng ti???n h??a ????n b???ng t???ng ti???n thanh to??n c??c m???c ' + String(this.totalAmountMilestone));
                return;
            }
            if (this.totalActualPaymentValueMilestone === this.purchaseInvoiceData.totalAmount) {
                // tslint:disable-next-line:max-line-length
                this.notification.showWarning('Kh??ng th??? th??m th??ng tin thanh to??n do t???ng ti???n c???a h??a ????n b???ng t???ng ti???n thanh to??n th???c t??? c??c m???c ' + String(this.totalActualPaymentValueMilestone));
                return;
            }
        }
    }

    public onBtnEditClick(rowData: any): void {
        this.isShowPaymentDialog = false;
        this.cdr.detectChanges();
        const strRowData = JSON.stringify(rowData);
        const objRowData = JSON.parse(strRowData);
        const params = {
            // id: objRowData.id,
            rowData: {
                ...objRowData,
                paymentTermDto: {
                    name: rowData.paymentTerm
                },
                totalAmount: this.purchaseInvoiceData.totalAmount,
                totalExchangeRate: rowData.exchangeRate ? (this.totalExchangeRate - rowData.exchangeRate) : this.totalExchangeRate,
                totalAmountMilestone: rowData.amount ? (this.totalAmountMilestone - rowData.amount) : this.totalAmountMilestone,
                // tslint:disable-next-line:max-line-length
                totalActualPaymentValueMilestone: rowData.actualPaymentValue ? (this.totalActualPaymentValueMilestone - rowData.actualPaymentValue) : this.totalActualPaymentValueMilestone,
            }
        };
        this.dialogRef.config.style = { width: '60vw' };
        this.dialogRef.config.title = 'S???a th??ng tin thanh to??n';
        this.dialogRef.input = params;
        this.isShowPaymentDialog = true;
        this.dialogRef.show();
        this.cdr.detectChanges();
    }

    public onBtnDeleteClick(rowData: any): void {
        const confirmation = new DeleteConfirmation();
        confirmation.accept = () => {
            this.purchaseInvoicePaymentService
                .delete(rowData.id)
                .subscribe((res) => {
                    this.notification.showSuccess();
                    this.initDataPiPayment();
                    this.cdr.detectChanges();
                });
        };
        this.notification.confirm(confirmation);
    }

}
