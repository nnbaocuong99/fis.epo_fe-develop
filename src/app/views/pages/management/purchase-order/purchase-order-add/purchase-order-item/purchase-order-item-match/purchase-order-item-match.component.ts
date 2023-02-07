import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-order-item-match.config';
import * as mainConfig from '../../../../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../../core/_base/component/base-component';
import { PurchaseRequestService } from '../../../../../../../services/modules/purchase-request/purchase-request.service';
import { PurchaseRequestItemService } from '../../../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import { PurchaseRequestRequestPayload } from '../../../../../../../services/modules/purchase-request/purchase-request.request-payload';
import { PurchaseOrderItemService } from '../../../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { NotificationService } from '../../../../../../../services/common/notification/notification.service';
import { SaveConfirmation } from '../../../../../../../services/common/confirmation/save-confirmation';
import { TreeNode } from 'primeng/api';
import { ItemService } from '../../../../../../../services/modules/category/item/item.service';
import { SupplierService } from '../../../../../../../services/modules/category/supplier/supplier.service';
import { ConfigListService } from '../../../../../../../services/modules/config-list/config-list.service';
import { CurrencyService } from '../../../../../../../services/modules/category/currency/currency.service';
import { ConfigListFactory } from '../../../../../../partials/control/config-list/config-list-control.service';
import { Guid } from 'guid-typescript';

@Component({
    selector: 'app-purchase-order-item-match',
    templateUrl: './purchase-order-item-match.component.html',
    styleUrls: ['./purchase-order-item-match.component.scss']
})
export class PurchaseOrderItemMatchComponent extends BaseComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @ViewChild('formSearch', { static: true }) formSearch: NgForm;
    @Input() dialogRef: DialogRef;
    @Output() success: EventEmitter<any> = new EventEmitter();

    public request: any;
    public requestItems: any;
    public itemTypes = config.ITEMS_TYPES;
    public dataSource = {
        items: null,
        paginatorTotal: undefined,
    };
    public cols = config.HEADER_PR;
    public headers = config.HEADER_PO_INTERNAL;
    public mainConfig = mainConfig.MAIN_CONFIG;
    public selectedPurchaseRequestItems: any = [];
    // public selectedPurchaseRequestItemsTemp: any = [];
    public isHidePrItem = false;
    public isHidePoItem = false;
    public frozenCols: any[];

    constructor(
        private purchaseRequestService: PurchaseRequestService,
        public purchaseRequestItemService: PurchaseRequestItemService,
        private purchaseOrderItemService: PurchaseOrderItemService,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        public itemService: ItemService,
        public supplierService: SupplierService,
        public currencyService: CurrencyService,
        public configListService: ConfigListService
    ) {
        super();
        this.request = new PurchaseRequestRequestPayload();
        this.requestItems = new PurchaseRequestRequestPayload();
    }

    ngOnInit() {
        this.frozenCols = [
            { width: '70px', title: 'PURCHASE_REQUEST.ITEM.ITEM_CODE', field: 'itemCode' },
        ];
        if (this.dialogRef.input.isInternal) {
            this.headers = config.HEADER_PO_INTERNAL;
        } else {
            this.headers = config.HEADER_PO_EXTERNAL;
        }
    }

    public loadNodes(event?: any) {
        this.request.pageIndex = event ? event.first / event.rows : 0;
        this.request.pageSize = event ? event.rows : 10;

        const purchaseRequestSub = forkJoin([
            this.purchaseRequestService.select(this.request),
            this.purchaseRequestService.count(this.request),
            this.purchaseRequestItemService.select(this.requestItems)
        ]).subscribe(res => {
            this.dataSource.items = [];
            this.dataSource.paginatorTotal = res[1];
            for (const el of res[0]) {
                const node: TreeNode = {
                    data: {
                        ...el,
                    },
                    children: [],
                    leaf: true,
                };
                const childItems = res[2].filter(m => m.isSubItem === false && m.prId === el.id);
                for (const child of childItems) {
                    const childNode = {
                        data: { ...child },
                        leaf: true,
                    };
                    node.children.push(childNode);
                    node.leaf = false;
                }
                if (node.children && node.children.length > 0) {
                    node.data.numberItems = node.children.length;
                    this.dataSource.items.push(node);
                }
            }
            this.dataSource.items.find(x => {
                if (x.children && x.children.length > 0) {
                    const index = x.children.findIndex(chil => (!chil.data.matchedId && !chil.data.classifyStatus));
                    if (index > -1) {
                        x.data.isShowCheckBoxParentItems = true;
                    }
                }
            });
            this.dataSource.items = [...this.dataSource.items];
            this.cdr.detectChanges();
        });
        this.subscriptions.push(purchaseRequestSub);
    }

    public onBtnResetSearchClick() {
        this.requestItems = new PurchaseRequestRequestPayload();
        this.request.prNo = null;
        this.loadNodes();
    }

    public onBtnSaveClick(): void {
        if (this.selectedPurchaseRequestItems && this.selectedPurchaseRequestItems.length > 0) {
            if (this.selectedPurchaseRequestItems.find(x => x.data && (x.data.matchedId || x.data.classifyStatus))) {
                this.notification.showWarning('Item đã được matched, vui lòng chọn item khác');
                return;
            }
            let amountSelected = 0;
            for (const element of this.selectedPurchaseRequestItems) {
                if (element.data.quantity && element.data.expectedPrice) {
                    amountSelected += this.rounding(element.data.quantity * element.data.expectedPrice);
                }
            }

            if (amountSelected !== this.rounding(this.dialogRef.input.rowData[0].quantity * this.dialogRef.input.rowData[0].price)) {
                this.notification.showWarning('Giá trị item không khớp với các item đã chọn');
                return;
            }

            const confirmation = new SaveConfirmation();
            let guideId: any = Guid.create().toString();
            guideId = guideId.split('-').join('');

            confirmation.accept = () => {
                const temp = [];
                this.selectedPurchaseRequestItems.find(x => {
                    if (x.parent && x.data) {
                        x.data.matchedId = guideId;
                        temp.push(x.data);
                    }
                });
                this.dialogRef.input.rowData[0].matchedId = guideId;
                const request = {
                    purchaseRequestItem: temp,
                    purchaseOrderItem: this.dialogRef.input.rowData
                };
                this.purchaseOrderItemService.bulkMatched(request).subscribe(res => {
                    if (res) {
                        this.loadNodes();
                        this.selectedPurchaseRequestItems = [];
                        this.notification.showSuccess();
                        this.dialogRef.hide();
                        this.success.emit();
                    }
                });
            };
            this.notification.confirm(confirmation);
        }

    }

    public rounding(value: number): number {
        return (Math.round(value * 100) / 100);
    }

}
