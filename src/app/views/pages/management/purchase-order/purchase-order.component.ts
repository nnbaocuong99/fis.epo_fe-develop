import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseOrderService } from '../../../../services/modules/purchase-order/purchase-order.service';
import { PurchaseOrderRequestPayload } from '../../../../services/modules/purchase-order/purchase-order.request-payload';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import { Router } from '@angular/router';
import * as config from './purchase-order.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
import { NgForm } from '@angular/forms';
import { CancelConfirmation } from '../../../../services/common/confirmation/cancel-confirmation';
import { OrganizationService } from '../../../../services/modules/category/organization-management/organization/organization.service';
import {
    OrganizationRequestPayload
} from '../../../../services/modules/category/organization-management/organization/organization.request.payload';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';
import { OperatingUnitService } from '../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { ProjectService } from '../../../../services/modules/category/project/project.service';
import { CurrencyService } from '../../../../services/modules/category/currency/currency.service';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { MenuItem } from 'primeng/api';
import { ReceiptService } from '../../../../services/modules/receipt/receipt.service';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { MatPaginator } from '@angular/material';
import { UserRequestPayload } from '../../../../services/modules/user/user-request.payload';
import { UserService } from '../../../../services/modules/user/user.service';
import { BrandService } from '../../../../services/modules/category/brand/brand.service';

@Component({
    selector: 'app-purchase-order',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.scss'],
})
export class PurchaseOrderComponent extends BaseComponent implements OnInit {
    btnItems: MenuItem[] = [
        { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewDialog(this.selectedRowData) },
        { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
        { label: 'Phê duyệt', icon: 'pi pi-fw pi-thumbs-up', disabled: true },
        { label: 'Hủy', icon: 'pi pi-fw pi-times', command: () => this.onBtnCancelClick(this.selectedRowData) },
        { label: 'Hóa đơn', icon: 'pi pi-fw pi-search', command: () => this.onBtnPurchaseInvoiceClick(this.selectedRowData) },
        { label: 'Lô hàng', icon: 'pi pi-fw pi-search', command: () => this.onBtnShipmentClick(this.selectedRowData) },
        { label: 'Theo dõi thanh toán', icon: 'far fa-money-check-alt', command: () => this.onBtnPaymentTracking(this.selectedRowData.id) },
        { label: 'Export Po', icon: 'far fa-money-check-alt', command: () => this.onBtnExportExcelPO(this.selectedRowData) }
    ];
    selectedRowData: any;

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    @ViewChild('formFilter', { static: true }) formFilter: NgForm;
    public dialogRef: DialogRef = new DialogRef();
    public toolbarModel: ToolbarModel;
    public organizationRequestPayload = new OrganizationRequestPayload();
    public purchaseOrderRequestPayload = new PurchaseOrderRequestPayload();
    public userRequestPayload = new UserRequestPayload();
    public tabs = config.TABS;
    public cols: any;
    public areaTypes = config.AREA_TYPE;
    public productTypes = config.PRODUCT_TYPES;
    public poStatus = config.PO_STATUS;
    public taxPayers = config.TAX_PAYERS;
    public headerUser = config.HEADER_USER;
    public panelOpenState = false;
    public activeIdTab: string;
    public mainConfig: any;
    public isShowFilterCommon = true;
    public isShowFilterService = true;
    public frozenCols: any[];

    public request: any = {};
    public dataSource = {
        items: null,
        paginatorTotal: undefined
    };

    constructor(
        public cdr: ChangeDetectorRef,
        public noticeService: NotificationService,
        public purchaseOrderService: PurchaseOrderService,
        public activatedRoute: ActivatedRoute,
        public userService: UserService,
        public organizationService: OrganizationService,
        public operatingUnitService: OperatingUnitService,
        public departmentService: DepartmentService,
        public projectService: ProjectService,
        public currencyService: CurrencyService,
        public supplierService: SupplierService,
        public receiptService: ReceiptService,
        public brandService: BrandService,
        public router: Router
    ) {
        super();
    }

    ngOnInit() {
        // Xử lý frozenCols table
        const temp = JSON.stringify(config.HEADER);
        this.cols = JSON.parse(temp);
        this.frozenCols = this.cols.slice(0, 4);
        this.cols.splice(0, 4);

        this.request = new PurchaseOrderRequestPayload();
        this.mainConfig = mainConfig.MAIN_CONFIG;
        this.configToolbar();
        if (window.history.state.purchaseRequestData) {
            this.request.prId = window.history.state.purchaseRequestData.id;
        }
        this.getCountByTabs();
        this.onFragmentChanged();
        this.pagingData();
    }

    public initData(): void {
        if (this.paginator) {
            this.request.pageIndex = this.paginator.pageIndex;
            this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
        }
        const requests = [
            this.purchaseOrderService.selectPost(this.request),
            this.purchaseOrderService.countPost(this.request)
        ];
        const sub = forkJoin(requests).subscribe(
            (response: any[]) => {
                this.dataSource.items = response[0];
                this.dataSource.paginatorTotal = response[1];
                this.cdr.detectChanges();
            });
        this.subscriptions.push(sub);
    }

    public pagingData(): void {
        if (this.paginator) {
            const paginatorSubscriptions = merge(this.paginator.page).pipe(
                tap(() => {
                    this.initData();
                })
            ).subscribe();
            this.subscriptions.push(paginatorSubscriptions);
        }
    }

    public setFragmentToRoute(event: any): void {
        this.router.navigate([], {
            queryParams: {
                status: event.nextId
            }
        });
    }

    private configToolbar(): void {
        this.toolbarModel = new ToolbarModel();
        this.toolbarModel.option.show = false;
        this.toolbarModel.add.routerLink = ['add'];
    }

    public onSearch(): void {
        this.initData();
        this.getCountByTabs();
    }

    private onFragmentChanged(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (!params.status) {
                this.request.status = null;
                this.activeIdTab = '0';
            } else {
                this.request.status = params.status;
                this.activeIdTab = params.status;
            }
            this.initData();
        });
    }

    public onBtnCancelClick(rowData: any): void {
        const confirmation = new CancelConfirmation();
        confirmation.accept = () => {
            const row = { ...rowData };
            row.status = this.poStatus[6].value;
            this.purchaseOrderService.merge(row).subscribe(res => {
                this.initData();
                this.getCountByTabs();
                this.noticeService.showCancelSuccess();
            });
        };
        this.noticeService.confirm(confirmation);
    }

    public onBtnViewDialog(rowData: any): void {
        this.router.navigate([`view/${rowData.id}`], { relativeTo: this.activatedRoute });
    }

    public onBtnEditClick(id: string): void {
        this.router.navigate([`edit/${id}`], { relativeTo: this.activatedRoute });
    }

    public onBtnPaymentTracking(id: string): void {
        this.router.navigate([`payment-tracking/${id}`], { relativeTo: this.activatedRoute });
    }

    public changeShowFilterCommon() {
        this.isShowFilterCommon = !this.isShowFilterCommon;
        if (!this.isShowFilterCommon) {
            this.request.projectCode = null;
            this.request.code = null;
            this.request.fromDate = null;
            this.request.toDate = null;
            this.request.areaType = null;
            this.request.taxpayer = null;
            this.request.ouCode = null;
            this.request.orgCode = null;
            this.request.orgApply = null;
            this.request.status = null;
            this.request.currency = null;
            this.request.hasCo = null;
            this.request.hasCq = null;
        }
    }

    public changeShowFilterService() {
        this.isShowFilterService = !this.isShowFilterService;
        if (!this.isShowFilterService) {
            this.request.supplierName = null;
            this.request.producerName = null;
            this.request.guarantee = null;
            this.request.deliveryLocation = null;
            this.request.itemType = null;
            this.request.isConformity = null;
        }
    }
    public onChangeLegal(event: any) {
        if (event) {
            this.request.ouCode = event.ouId;
            this.request.ouName = event.code;
            this.organizationRequestPayload.ouId = event.ouId;
        } else {
            this.request.ouCode = null;
            this.request.ouName = null;
            this.organizationRequestPayload.ouId = null;
        }
    }

    public onChangeProjectCode(event: any): void {
        if (event) {
            this.purchaseOrderRequestPayload.projectCode = event.code;
            this.request.projectCode = event.code;
        } else {
            this.purchaseOrderRequestPayload.projectCode = null;
            this.request.projectCode = null;
        }
    }

    public onChangeSupplier(event: any): void {
        if (event) {
            this.request.vendorId = event.vendorId;
            this.request.supplierName = event.name;
        } else {
            this.request.vendorId = null;
            this.request.supplierName = null;
        }
    }

    public onBtnResetSearchClick() {
        this.request = new PurchaseOrderRequestPayload();
        this.initData();
    }

    private getCountByTabs(): void {
        this.purchaseOrderService.countItemsGroupByStatusPost(this.request).subscribe(m => {
            for (const tab of this.tabs) {
                for (const item of m) {
                    if (tab.value === item.status) {
                        tab.count = item.count;
                    }
                }
            }
        });
    }

    public onShowContextMenu() {
        // tslint:disable-next-line:max-line-length
        this.btnItems[1].visible = this.selectedRowData.status !== this.poStatus[2].value && this.selectedRowData.status !== this.poStatus[5].value && this.selectedRowData.status !== this.poStatus[6].value;
        this.btnItems[2].visible = this.selectedRowData.status !== this.poStatus[2].value;
        // tslint:disable-next-line:max-line-length
        this.btnItems[3].visible = this.selectedRowData.status === this.poStatus[0].value || this.selectedRowData.status === this.poStatus[3].value;
        this.btnItems[4].visible = this.selectedRowData.status !== 1 && this.selectedRowData.status !== 2;
        this.btnItems[5].visible = this.selectedRowData.status !== 1 && this.selectedRowData.status !== 2;
        this.btnItems[7].visible = this.selectedRowData.areaType === 1 || this.selectedRowData.areaType === 2;
    }

    public onChangeProductName(producerNameDto: any): void {
        if (producerNameDto) {
            this.request.producerName = producerNameDto.acronymName;
            this.request.producerId = producerNameDto.id;
        }
    }

    public onBtnPurchaseInvoiceClick(rowData: any): void {
        this.router.navigate([`../../purchase-invoice/list`],
            {
                relativeTo: this.activatedRoute,
                state: {
                    purchaseOrderData: rowData
                }
            });
    }

    public onBtnShipmentClick(rowData: any): void {
        this.router.navigate([`../../shipment/list`],
            {
                relativeTo: this.activatedRoute,
                state: {
                    purchaseOrderData: rowData
                }
            });
    }

    public onBtnExportExcelPO(rowData: any): void {
        const request = new PurchaseOrderRequestPayload();
        request.id = rowData.id;
        this.purchaseOrderService.exportAll(request, rowData.code).subscribe(() => {
            this.noticeService.showMessage('Export complete');
        });
    }

}
