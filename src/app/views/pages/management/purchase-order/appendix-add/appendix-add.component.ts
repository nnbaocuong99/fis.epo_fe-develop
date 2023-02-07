import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import * as config from './appendix-add.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { PurchaseOrderRequestPayload } from '../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { DeleteConfirmation } from '../../../../../services/common/confirmation/delete-confirmation';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { AppendixDialogComponent } from './appendix-dialog/appendix-dialog.component';

@Component({
    selector: 'app-appendix-add',
    templateUrl: './appendix-add.component.html',
    styleUrls: ['./appendix-add.component.scss']
})
export class AppendixAddComponent extends BaseComponent implements OnInit {
    @ViewChild('appendixDialog', { static: true }) appendixDialog: AppendixDialogComponent;
    public headers = config.HEADER;
    public mainConfig = mainConfig.MAIN_CONFIG;
    public request: any;
    public dataSource = {
        items: null,
        paginatorTotal: undefined,
    };
    public purchaseOrderData: any = {};
    public dialogRef: DialogRef = new DialogRef();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        public purchaseOrderService: PurchaseOrderService
    ) {
        super();
    }

    ngOnInit() {
        this.request = new PurchaseOrderRequestPayload();
        const routeSub = this.route.params.subscribe(params => {
            if (params.id) {
                this.request.rootPoId = params.id;
                this.purchaseOrderService.selectById(params.id).subscribe(res => {
                    this.purchaseOrderData = res;
                    this.initData();
                });
            }
        });
        this.subscriptions.push(routeSub);
    }

    private initData(): void {
        if (!this.purchaseOrderData.rootPoId) {
            const dataSub = this.purchaseOrderService.select(this.request).subscribe(res => {
                this.dataSource.items = res;
                this.cdr.detectChanges();
            });
            this.subscriptions.push(dataSub);
        } else {
            const dataSub = this.purchaseOrderService.selectById(this.purchaseOrderData.rootPoId).subscribe(res => {
                this.dataSource.items = [];
                this.dataSource.items.push(res);
                this.cdr.detectChanges();
            });
            this.subscriptions.push(dataSub);
        }

    }

    public onSuccess(data: any): any {
        this.initData();
        this.cdr.detectChanges();
    }

    public onBtnAddClick(): void {
        const strRowData = JSON.stringify(this.purchaseOrderData);
        const objRowData = JSON.parse(strRowData);
        const params = {
            id: null,
            rowData: objRowData
        };
        params.rowData.rootPoId = params.rowData.id;
        this.dialogRef.input = params;
        this.dialogRef.input.action = 'add';
        this.appendixDialog.initData(false);
        this.dialogRef.show();
        this.cdr.detectChanges();
    }

    public onBtnEditClick(id: any): void {
        const sub = this.purchaseOrderService.selectById(id).subscribe(res => {
            const params = {
                id: res.id,
                rowData: res,
            };
            this.dialogRef.input = params;
            this.dialogRef.input.action = 'edit';
            this.appendixDialog.initData(true);
            this.dialogRef.show();
            this.cdr.detectChanges();
        });
        this.subscriptions.push(sub);
    }

    public onBtnDeleteClick(id: any): void {
        const confirmation = new DeleteConfirmation();
        confirmation.accept = () => {
            this.purchaseOrderService
                .delete(id)
                .subscribe((res) => {
                    this.notification.showSuccess();
                    this.initData();
                    this.cdr.detectChanges();
                });
        };
        this.notification.confirm(confirmation);
    }
}
