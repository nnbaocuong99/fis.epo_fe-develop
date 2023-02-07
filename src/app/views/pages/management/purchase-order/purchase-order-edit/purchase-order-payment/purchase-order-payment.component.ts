import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from '../purchase-order-edit.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { DeleteConfirmation } from '../../../../../../services/common/confirmation/delete-confirmation';
import { BaseListComponent } from '../../../../../../core/_base/component/base-list.component';
import { PurchaseOrderPaymentService } from '../../../../../../services/modules/purchase-order-payment/purchase-order-payment.service';
import { DatePipe } from '@angular/common';
import {
    PurchaseOrderPaymentRequestPayload
} from '../../../../../../services/modules/purchase-order-payment/purchase-order-payment.request-payload';
import { PaymentTermService } from '../../../../../../services/modules/category/payment-term/payment-term.service';

@Component({
    selector: 'app-purchase-order-payment',
    templateUrl: './purchase-order-payment.component.html',
    styleUrls: ['./purchase-order-payment.component.scss']
})
export class PurchaseOrderPaymentComponent extends BaseListComponent implements OnInit {
    @Input() purchaseOrderData: any;
    @Input() viewMode = false;
    public mainConfig: any;
    public request: any;
    public dialogRef: DialogRef = new DialogRef();
    public headers = config.HEADER_PAYMENT;
    public isShowPaymentDialog = false;
    public paymentTermData: any;
    public totalRatio = 0;
    public totalAmountMilestone = 0;
    constructor(
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        private paymentTermService: PaymentTermService,
        public purchaseOrderPaymentService: PurchaseOrderPaymentService
    ) {
        super();
    }

    ngOnInit() {
        this.baseService = this.purchaseOrderPaymentService;
        this.request = new PurchaseOrderPaymentRequestPayload();
        this.mainConfig = mainConfig.MAIN_CONFIG;
        const routeSub = this.route.params.subscribe(params => {
            if (params.id) {
                this.request.poId = params.id;
                this.initDataPoPayment();
                this.pagingData();
            }
        });
        this.subscriptions.push(routeSub);
        this.paymentTermService.select().subscribe(res => {
            if (res) {
                this.paymentTermData = res;
            }
        });
    }

    public initDataPoPayment(): void {
        this.initData();
        const arr = [];
        this.fnSuccess = () => {
            if (this.dataSource.items && this.dataSource.items.length > 0) {

                // Tổng tỷ lệ (%)
                let totalRatio = 0;
                // Tổng tiền của các mốc thanh toán
                let totalAmountMilestone = 0;
                for (const element of this.dataSource.items) {
                    if (element.ratio) {
                        totalRatio += +element.ratio;
                    }
                    if (element.amount) {
                        totalAmountMilestone += +element.amount;
                    }
                    if (element.milestoneDate) {
                        // tính ngày thanh toán hiển thị table do không lưu db
                        const paymentTermTemp = Number(element.paymentTerm.slice(0, -1));
                        const temp = new Date(element.milestoneDate);
                        const dateTemp = new Date(temp.setDate(temp.getDate() + paymentTermTemp));
                        const datePipe = new DatePipe('en-US');
                        element.paymentDate = datePipe.transform(new Date(dateTemp.toString()), 'yyyy-MM-dd');
                    }
                    arr.push(element);
                }
                this.dataSource.items = arr;
                this.totalRatio = totalRatio;
                this.totalAmountMilestone = totalAmountMilestone;
                this.cdr.detectChanges();
            }
        };
    }

    public onSuccess(data: any): any {
        this.initDataPoPayment();
        this.cdr.detectChanges();
    }

    public onBtnAddClick(): void {
        if (this.totalRatio < 100 && this.totalAmountMilestone < this.purchaseOrderData.totalAmount) {
            this.isShowPaymentDialog = false;
            this.cdr.detectChanges();
            const params = {
                rowData: {
                    poId: this.request.poId,
                    status: null,
                    milestoneDate: this.purchaseOrderData.signDate,
                    paymentTerm: this.purchaseOrderData.paymentTerm,
                    paymentTermDto: {
                        name: this.purchaseOrderData.paymentTerm
                    },
                    totalAmount: this.purchaseOrderData.totalAmount,
                    paymentDate: null,
                    totalRatio: this.totalRatio,
                    totalAmountMilestone: this.totalAmountMilestone
                }
            };
            if (params.rowData.paymentTerm && params.rowData.milestoneDate) {
                const paymentTermTemp = Number(params.rowData.paymentTerm.slice(0, -1));
                const temp = new Date(params.rowData.milestoneDate);
                const dateTemp = new Date(temp.setDate(temp.getDate() + paymentTermTemp));
                params.rowData.paymentDate = dateTemp;
            }
            this.dialogRef.input = params;
            this.dialogRef.config.style = { width: '60vw' };
            this.dialogRef.config.title = 'Thêm thông tin thanh toán';
            this.isShowPaymentDialog = true;
            this.dialogRef.show();
            this.cdr.detectChanges();
        } else {
            if (this.totalRatio === 100) {
                // tslint:disable-next-line:max-line-length
                this.notification.showWarning('Không thể thêm thông tin thanh toán do tổng tỷ lệ thanh toán các mốc là ' + String(this.totalRatio) + '%');
                return;
            }
            if (this.totalAmountMilestone === this.purchaseOrderData.totalAmount) {
                // tslint:disable-next-line:max-line-length
                this.notification.showWarning('Không thể thêm thông tin thanh toán do tổng tiền đơn hàng đã bằng tổng tiền thanh toán các mốc ' + String(this.totalAmountMilestone));
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
                totalRatio: rowData.ratio ? (this.totalRatio - rowData.ratio) : this.totalRatio,
                totalAmount: this.purchaseOrderData.totalAmount,
                totalAmountMilestone: rowData.amount ? (this.totalAmountMilestone - rowData.amount) : this.totalAmountMilestone,
            }
        };
        this.dialogRef.config.style = { width: '60vw' };
        this.dialogRef.config.title = 'Sửa thông tin thanh toán';
        this.dialogRef.input = params;
        this.isShowPaymentDialog = true;
        this.dialogRef.show();
        this.cdr.detectChanges();
    }

    public onBtnDeleteClick(rowData: any): void {
        const confirmation = new DeleteConfirmation();
        confirmation.accept = () => {
            this.purchaseOrderPaymentService
                .delete(rowData.id)
                .subscribe((res) => {
                    this.notification.showSuccess();
                    this.initDataPoPayment();
                    this.cdr.detectChanges();
                });
        };
        this.notification.confirm(confirmation);
    }

}
