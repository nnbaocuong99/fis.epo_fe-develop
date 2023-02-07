import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentCostBillRequestPayload } from '../../../../../../services/modules/shipment-cost-bill/shipment-cost-bill.request-payload';
import { ShipmentCostBillService } from '../../../../../../services/modules/shipment-cost-bill/shipment-cost-bill.service';
import { BaseListComponent } from '../../../../../../core/_base/component/base-list.component';
import * as mainConfig from '../../../../../../core/_config/main.config';
import * as config from '../shipment-edit.config';
import { DeleteConfirmation } from '../../../../../../services/common/confirmation/delete-confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { PurchaseOrderService } from '../../../../../../services/modules/purchase-order/purchase-order.service';
import { PurchaseOrderRequestPayload } from '../../../../../../services/modules/purchase-order/purchase-order.request-payload';

@Component({
    selector: 'app-shipment-cost-bill',
    templateUrl: './shipment-cost-bill.component.html',
    styleUrls: ['./shipment-cost-bill.component.scss'],
})
export class ShipmentCostBillComponent
    extends BaseListComponent
    implements OnInit {
    @Input() shipmentData: any = {};

    _shipmentItemsData: any;
    get shipmentItemsData(): any {
        return this._shipmentItemsData;
    }
    @Input() set shipmentItemsData(value: any) {
        this._shipmentItemsData = value;

        if (this.shipmentItemsData && this.shipmentItemsData.items.length > 0) {
            const itemsSource = this.convertDataTreeToItemSource(this.shipmentItemsData.items);
            const declarationNumber = this.shipmentData.declarationNumber;
            const poCode = Object.keys(this.groupBy(itemsSource.filter(x => x.poCode), 'poCode')).join('-->');
            const orgApplyName = Object.keys(this.groupBy(itemsSource.filter(x => x.orgApplyName), 'orgApplyName')).join('-->');
            const contractNo = Object.keys(this.groupBy(itemsSource.filter(x => x.contractNo), 'contractNo')).join('-->');

            const suggestionsNote = [];
            if (declarationNumber) {
                suggestionsNote.push(declarationNumber);
            }
            if (poCode) {
                suggestionsNote.push(poCode);
            }
            if (orgApplyName) {
                suggestionsNote.push(orgApplyName);
            }
            if (contractNo) {
                suggestionsNote.push(contractNo);
            }
            this.suggestionsInvoiceDesc = suggestionsNote.join('-->');
        }
    }
    @Input() editTable = true;
    @Output() success: EventEmitter<any> = new EventEmitter();

    public mainConfig: any = mainConfig.MAIN_CONFIG;
    public headerCostBill = config.HEADER_COST_BILL;
    public statusInvoices = config.STATUS_INVOICE;
    public statusERPs = config.SYNC_ERP;
    public elimStatus = config.ELIM_STATUS;
    public isEditMode = false;
    public purchaseInvoiceData: any = {};
    public purchaseOrderData: any;
    public dataSource: any = {
        items: [],
        paginatorTotal: null,
    };
    public reuqestShipmentCostBill: ShipmentCostBillRequestPayload = new ShipmentCostBillRequestPayload();
    public listFilter = [
        'invoiceType',
        'costType',
        'code',
        'date',
        'totalAmount',
        'totalActualPaymentValue',
        'invoiceDesc',
        'status',
        'syncStatus',
        'poCode',
    ];
    public suggestionsInvoiceDesc: string;

    constructor(
        public router: Router,
        public shipmentCostBill: ShipmentCostBillService,
        private purchaseOrderService: PurchaseOrderService,
        private cdRef: ChangeDetectorRef,
        private noticeService: NotificationService,
        private route: ActivatedRoute
    ) {
        super();
    }

    ngOnInit() {
        this.baseService = this.shipmentCostBill;
        if (this.shipmentData && this.shipmentData.id) {
            this.reuqestShipmentCostBill.shipmentId = this.shipmentData.id;
        }
        this.reuqestShipmentCostBill.isIncludeCancelStatus = true;
        this.request = this.reuqestShipmentCostBill;
        this.mainConfig = mainConfig.MAIN_CONFIG;
        this.cd = this.cdRef;
        this.getPurchaseOrderData();
        super.ngOnInit();
    }

    public getPurchaseOrderData(): void {
        const requestPo = new PurchaseOrderRequestPayload();
        this.shipmentItemsData.items.find(x => requestPo.id = x.data.poId);
        this.purchaseOrderService.selectById(requestPo.id).subscribe(res => {
            if (res) {
                this.purchaseOrderData = res;
            }
        });
    }

    // Sửa hóa đơn
    public onBtnEditClick(id: string): void {
        this.router.navigate([`../../../../purchase-invoice/list/edit/${id}`],
            {
                relativeTo: this.route,
                state: {
                    fromSm: true,
                    shipmentData: this.shipmentData,
                }
            });
    }

    // Xóa hóa đơn khỏi lô hàng
    public onBtnDeleteClick(id: string): void {
        const confirmation = new DeleteConfirmation();
        confirmation.accept = () => {
            this.shipmentCostBill.delete(id).subscribe(() => {
                this.initData();
                this.noticeService.showDeteleSuccess();
                this.success.emit();
            });
        };
        this.noticeService.confirm(confirmation);
    }

    public onBtnAddPIClick(): void {
        this.isEditMode = true;
    }

    public onBtnAddPIInsuranceClick(): void {
        this.purchaseInvoiceData.costTypeDto = {
            costType: 'Bảo hiểm',
            code: '2'
        };
        this.purchaseInvoiceData.invoiceDesc = this.suggestionsInvoiceDesc;
        this.configInvoiceData();
    }

    public onBtnAddPITransportClick(): void {
        this.purchaseInvoiceData.costTypeDto = {
            costType: 'Vận tải',
            code: '3'
        };
        this.purchaseInvoiceData.invoiceDesc = this.suggestionsInvoiceDesc;
        this.configInvoiceData();
    }

    public onBtnAddImportTaxClick(): void {
        this.purchaseInvoiceData.costTypeDto = {
            costType: 'Thuế NK',
            code: '8'
        };
        this.purchaseInvoiceData.invoiceDesc = this.suggestionsInvoiceDesc;
        this.configInvoiceData();
    }

    public onBtnAddImportVatTaxClick(): void {
        this.purchaseInvoiceData.costTypeDto = {
            costType: 'Thuế VAT NK',
            code: '9'
        };
        this.purchaseInvoiceData.invoiceDesc = this.suggestionsInvoiceDesc;
        this.configInvoiceData();
    }

    public configInvoiceData(): void {
        if (this.purchaseOrderData && this.purchaseInvoiceData.costTypeDto.code === '8'
            || this.purchaseInvoiceData.costTypeDto.code === '9') {
            this.shipmentData.projectCode = this.purchaseOrderData.projectCode ? this.purchaseOrderData.projectCode : null;
            this.shipmentData.ouCode = this.purchaseOrderData.ouCode ? this.purchaseOrderData.ouCode : null;
            this.shipmentData.ouName = this.purchaseOrderData.ouName ? this.purchaseOrderData.ouName : null;
            this.shipmentData.orgApply = this.purchaseOrderData.orgApply ? this.purchaseOrderData.orgApply : null;
            this.shipmentData.orgApplyName = this.purchaseOrderData.orgApplyName ? this.purchaseOrderData.orgApplyName : null;
        }
        if (this.shipmentData && this.shipmentData.id) {
            // this.purchaseInvoiceData.costType = 'Bảo hiểm';
            this.router.navigate(['../../../../purchase-invoice/list/add'], {
                relativeTo: this.route,
                state: {
                    fromSm: true,
                    shipmentData: this.shipmentData,
                    purchaseInvoiceData: this.purchaseInvoiceData,
                    purchaseOrderData: this.purchaseOrderData
                }
            });
        }
    }

    public groupBy(xs: any[], key: string) {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    public convertDataTreeToItemSource(shipmentItemData: any): any {
        const arr = [];
        shipmentItemData.map(item => {
            arr.push(item.data);
            if (item.children && item.children.length > 0) {
                item.children.map(chi => {
                    arr.push(chi.data);
                });
            }
        });
        return arr;
    }
}
