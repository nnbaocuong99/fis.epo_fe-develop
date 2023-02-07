import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { PurchaseRequestRequestPayload } from '../../../../services/modules/purchase-request/purchase-request.request-payload';
import { PurchaseRequestService } from '../../../../services/modules/purchase-request/purchase-request.service';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import * as config from './purchase-request.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { OrganizationService } from '../../../../services/modules/category/organization-management/organization/organization.service';
import { CancelConfirmation } from '../../../../services/common/confirmation';
import { OperatingUnitService } from '../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';
import { ProjectService } from '../../../../services/modules/category/project/project.service';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../../../services/modules/user/user.service';
import { state } from '@angular/animations';


@Component({
    selector: 'app-purchase-request',
    templateUrl: './purchase-request.component.html',
    styleUrls: ['./purchase-request.component.scss']
})
export class PurchaseRequestComponent extends BaseListComponent implements OnInit {
    public prStatus = config.PR_STATUS;

    selectedRowData: any = {};
    btnItems: MenuItem[] = [
        { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewDialog(this.selectedRowData) },
        { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
        { label: 'Hủy', icon: 'pi pi-fw pi-times', command: () => this.onBtnCancelClick(this.selectedRowData) },
        { label: 'Đơn hàng', icon: 'pi pi-fw pi-search', command: () => this.onBtnPurchaseOrderClick(this.selectedRowData) },
        { label: 'Hóa đơn', icon: 'pi pi-fw pi-search', command: () => this.onBtnPurchaseInvoiceClick(this.selectedRowData) },
        { label: 'Lô hàng', icon: 'pi pi-fw pi-search', command: () => this.onBtnShipmentClick(this.selectedRowData) },
    ];

    public toolbarModel: ToolbarModel;
    public tabs = config.TABS;
    public prContractInfo = config.PR_CONTRACT_INFO;
    public dialogRef: DialogRef = new DialogRef();
    public selectedRow: any;
    public arrEmpty = [];
    public activeIdTab: number;
    public frozenCols: any[];
    public createdByNameDto: any;

    constructor(
        public purchaseRequestService: PurchaseRequestService,
        public noticeService: NotificationService,
        public activatedRoute: ActivatedRoute,
        public operatingUnitService: OperatingUnitService,
        public organizationService: OrganizationService,
        public departmentService: DepartmentService,
        public projectService: ProjectService,
        public userService: UserService,
        public router: Router,
    ) {
        super();
    }

    ngOnInit() {
        // Xử lý frozenCols table
        const temp = JSON.stringify(config.HEADER);
        this.headers = JSON.parse(temp);
        this.frozenCols = this.headers.slice(0, 3);
        this.headers.splice(0, 3);

        this.baseService = this.purchaseRequestService;
        this.request = new PurchaseRequestRequestPayload();
        this.formTitle = 'PURCHASE_REQUEST.HEADER';
        this.mainConfig = mainConfig.MAIN_CONFIG;
        this.configToolbar();
        this.getCountByTabs();
        this.onQueryParamsChanged();
        this.pagingData();
    }

    private configToolbar(): void {
        this.toolbarModel = new ToolbarModel();
        this.toolbarModel.option.disabled = true;
        this.toolbarModel.add.routerLink = ['add'];
        this.toolbarModel.search.click = this.search;
    }

    search = () => {
        this.router.navigate([], {
            queryParams: {
                prStatus: this.request.prStatus
            }
        });
        this.activeIdTab = +this.request.prStatus;
        this.initData();
        this.getCountByTabs();
    }

    public setFragmentToRoute(event: any): void {
        if (event.nextId) {
            this.router.navigate([], {
                queryParams: {
                    prStatus: event.nextId
                }
            });
        } else {
            this.router.navigate([]);
        }

    }

    private onQueryParamsChanged(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (!params.prStatus && !this.tabs.some(x => x.value === params.prStatus)) {
                this.request.prStatus = null;
                this.activeIdTab = 0;
            } else {
                this.request.prStatus = params.prStatus;
                this.activeIdTab = +params.prStatus;
            }
            this.initData();
        });
    }

    public onBtnCancelClick(rowData: any): void {
        const confirmation = new CancelConfirmation();
        confirmation.accept = () => {
            // update trạng thái pr huỷ = 7
            rowData.prStatus = this.prStatus[6].value;
            this.purchaseRequestService.merge(rowData).subscribe(() => {
                this.initData();
                this.getCountByTabs();
                this.noticeService.showSuccess();
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

    public onBtnResetSearchClick() {
        this.request = new PurchaseRequestRequestPayload();
        this.initData();
    }

    private getCountByTabs() {
        this.purchaseRequestService.countItemsGroupByStatus(this.request).subscribe(m => {
            for (const tab of this.tabs) {
                tab.count = 0;
                for (const item of m) {
                    if (tab.value === item.prStatus) {
                        tab.count = item.count;
                    }
                }
            }
        });
    }

    public onShowContextMenu() {
        // tslint:disable-next-line:max-line-length
        this.btnItems[1].visible = this.selectedRowData.prStatus !== this.prStatus[5].value && this.selectedRowData.prStatus !== this.prStatus[6].value;
        this.btnItems[2].visible = this.selectedRowData.prStatus === 1 || this.selectedRowData.prStatus === 4;
        this.btnItems[3].visible = this.selectedRowData.prStatus !== 1 && this.selectedRowData.prStatus !== 2;
        this.btnItems[4].visible = this.selectedRowData.prStatus !== 1 && this.selectedRowData.prStatus !== 2;
        this.btnItems[5].visible = this.selectedRowData.prStatus !== 1 && this.selectedRowData.prStatus !== 2;
    }


    public onBtnPurchaseOrderClick(rowData: any): void {
        // const url = this.router.serializeUrl(
        //     this.router.createUrlTree([`../../purchase-order/list`],
        //         {
        //             relativeTo: this.activatedRoute,
        //             state: {
        //                 purchaseRequestData: rowData
        //             }
        //         }
        //     ));
        // // open new tab
        // window.open(url, '_blank');
        this.router.navigate([`../../purchase-order/list`],
            {
                relativeTo: this.activatedRoute,
                state: {
                    purchaseRequestData: rowData
                }
            });
    }

    public onBtnPurchaseInvoiceClick(rowData: any): void {
        this.router.navigate([`../../purchase-invoice/list`],
            {
                relativeTo: this.activatedRoute,
                state: {
                    purchaseRequestData: rowData
                }
            });
    }

    public onBtnShipmentClick(rowData: any): void {
        this.router.navigate([`../../shipment/list`],
            {
                relativeTo: this.activatedRoute,
                state: {
                    purchaseRequestData: rowData
                }
            });
    }

}
