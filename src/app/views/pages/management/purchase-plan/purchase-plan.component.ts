import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { PurchasePlanRequestPayload } from '../../../../services/modules/purchase-plan/purchase-plan.request-payload';
import { PurchasePlanService } from '../../../../services/modules/purchase-plan/purchase-plan.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import * as config from './purchase-plan.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
import { CancelConfirmation } from '../../../../services/common/confirmation/cancel-confirmation';
import { ProjectService } from '../../../../services/modules/category/project/project.service';
import { ContractService } from '../../../../services/modules/contract/contract.service';
import { MenuItem } from 'primeng';
import { LayoutConfigService } from '../../../../core/_base/layout';
import { UserService } from '../../../../services/modules/user/user.service';
import { UserRequestPayload } from '../../../../services/modules/user/user-request.payload';
import { PurchaseRequestRequestPayload } from '../../../../services/modules/purchase-request/purchase-request.request-payload';
import { PurchaseRequestService } from '../../../../services/modules/purchase-request/purchase-request.service';
import { PurchaseOrderRequestPayload } from '../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../services/modules/purchase-order/purchase-order.service';
import { PurchaseInvoiceService } from '../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { ShipmentService } from '../../../../services/modules/shipment/shipment.service';
import { ShipmentRequestPayload } from '../../../../services/modules/shipment/shipment.request-payload';
import { PurchaseInvoiceRequestPayload } from '../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
@Component({
  selector: 'app-purchase-plan',
  templateUrl: './purchase-plan.component.html',
  styleUrls: ['./purchase-plan.component.scss']
})
export class PurchasePlanComponent extends BaseListComponent implements OnInit, AfterViewChecked {
  public selectedRowData: any = {};
  public contextItems: MenuItem[] = [
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewDialog(this.selectedRowData) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
    { label: 'Hủy', icon: 'pi pi-fw pi-times', command: () => this.onBtnCancelClick(this.selectedRowData) },
    { label: 'YCMH', icon: 'pi pi-fw pi-search', command: () => this.onBtnSelectPurchaseRequestClick(this.selectedRowData) },
    { label: 'Đơn hàng', icon: 'pi pi-fw pi-search', command: () => this.onBtnSelectPurchaseOrderClick(this.selectedRowData) },
    { label: 'Hóa đơn', icon: 'pi pi-fw pi-search', command: () => this.onBtnSelectPurchaseInvoiceClick(this.selectedRowData) },
    { label: 'Lô hàng', icon: 'pi pi-fw pi-search', command: () => this.onBtnSelectShipmentClick(this.selectedRowData) },
  ];

  public toolbarModel: ToolbarModel;
  public userRequestPayload = new UserRequestPayload();
  public mainConfig = mainConfig.MAIN_CONFIG;
  public headerUser = config.HEADER_USER;
  public tabs = config.TABS;
  public dialogRef: DialogRef = new DialogRef();
  public activeIdTab: string;
  public frozenCols: any[];
  public createdByNameDto: any;
  public isShowDialogPurchaseRequest = false;
  public headerPurchaseRequest = config.HEADER_PR;
  public purchaseRequestData: any;
  public ppStatus = config.PP_STATUS;
  public prStatus = config.PR_STATUS;
  public ppName: string;
  public isShowDialogPurchaseOrder = false;
  public headerPurchaseOrder = config.HEADER_PO;
  public purchaseOrderData: any;
  public poAreaTypes = config.PO_AREA_TYPE;
  public poStatus = config.PO_STATUS;

  public isShowDialogPurchaseInvoice = false;
  public headerPurchaseInvoice = config.HEADER_INVOICE;
  public purchaseInvoiceData: any;

  public isShowDialogShipment = false;
  public headerShipment = config.HEADER_SHIPMENT;
  public shipmentStatus = config.SHIPMENT_STATUS;
  public syncErp = config.SHIPMENT_SYNC_ERP;
  public shipmentData: any;

  constructor(
    public purchasePlanService: PurchasePlanService,
    public purchaseRequestService: PurchaseRequestService,
    public purchaseOrderService: PurchaseOrderService,
    public purchaseInvoiceService: PurchaseInvoiceService,
    public shipmentService: ShipmentService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public notification: NotificationService,
    public cd: ChangeDetectorRef,
    public projectService: ProjectService,
    public contractService: ContractService,
    public userService: UserService,
    public layoutConfigService: LayoutConfigService
  ) {
    super();
  }

  ngOnInit() {
    // Xử lý frozenCols table
    const temp = JSON.stringify(config.HEADER);
    this.headers = JSON.parse(temp);
    this.frozenCols = this.headers.slice(0, 3);
    this.headers.splice(0, 3);

    this.baseService = this.purchasePlanService;
    this.request = new PurchasePlanRequestPayload();
    this.formTitle = 'PURCHASE_PLAN.HEADER_LIST';
    this.configToolbar();
    this.getCountByTabs();
    this.onFragmentChanged();
    this.pagingData();
  }

  ngAfterViewChecked() {
    this.getScrollElement();
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.disabled = true;
    this.toolbarModel.add.routerLink = [`add`];
  }

  public onBtnCancelClick(rowData: any): void {
    const confirmation = new CancelConfirmation();
    confirmation.accept = () => {
      // Update trạng thái huỷ = 3
      rowData.status = this.ppStatus[3].value;
      this.purchasePlanService.merge(rowData).subscribe(() => {
        this.onFragmentChanged();
        this.notification.showDeteleSuccess();
      });
    };
    this.notification.confirm(confirmation);
  }

  public onBtnEditClick(id: string): void {
    this.router.navigate([`edit/${id}`], { relativeTo: this.activatedRoute });
  }

  public onBtnViewDialog(rowData: any): void {
    this.router.navigate([`view/${rowData.id}`], { relativeTo: this.activatedRoute });
  }

  public onBtnSearchClick(): void {
    this.router.navigate([], {
      queryParams: {
        status: this.request.status
      }
    }).then(() => {
      this.activeIdTab = this.request.status;
      this.initData();
    });
  }

  public onSearch(): void {
    this.initData();
    this.getCountByTabs();
  }

  private onFragmentChanged(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (!params.status) {
        this.request.status = null;
        this.activeIdTab = '';
      } else {
        this.request.status = params.status;
        this.activeIdTab = params.status;
      }
      this.initData();
    });
  }

  private getCountByTabs(): void {
    this.purchasePlanService.countByStatus(this.request).subscribe(res => {
      if (res && res.length > 0) {
        for (const item of this.tabs) {
          item.count = res.find(x => x.status === item.value) ?
            res.find(x => x.status === item.value).count : 0;
        }
        this.cd.detectChanges();
      }
    });
  }

  public setParamsToRoute(event: any): void {
    this.router.navigate([], {
      queryParams: {
        status: event.nextId
      }
    });
  }

  public addTagFn(name: string) {
    return name;
  }

  public onBtnResetSearchClick() {
    this.request = new PurchasePlanRequestPayload();
    this.initData();
  }

  public getScrollElement(): void {
    this.layoutConfigService.scrollElement = document.getElementsByClassName('p-datatable-scrollable-body')[1];
  }

  public onShowContextMenu() {
    this.contextItems[1].visible = this.selectedRowData.status !== 2 && this.selectedRowData.status !== 3;
    this.contextItems[2].visible = this.selectedRowData.status !== 2 && this.selectedRowData.status !== 3;
    this.contextItems[3].visible = this.selectedRowData.status !== 0;
    this.contextItems[4].visible = this.selectedRowData.status !== 0;
    this.contextItems[5].visible = this.selectedRowData.status !== 0;
    this.contextItems[6].visible = this.selectedRowData.status !== 0;
  }

  public onBtnSelectPurchaseRequestClick(rowData: any): void {
    const request = new PurchaseRequestRequestPayload();
    request.ppId = rowData.id;
    this.ppName = rowData.code;
    this.purchaseRequestService.select(request).subscribe(res => {
      this.purchaseRequestData = res;
      this.isShowDialogPurchaseRequest = true;
      this.cd.detectChanges();
    });
  }

  public onBtnSelectPurchaseOrderClick(rowData: any): void {
    const request = new PurchaseOrderRequestPayload();
    request.ppId = rowData.id;
    this.ppName = rowData.code;
    this.purchaseOrderService.select(request).subscribe(res => {
      this.purchaseOrderData = res;
      this.isShowDialogPurchaseOrder = true;
      this.cd.detectChanges();
    });
  }

  public onBtnSelectPurchaseInvoiceClick(rowData: any): void {
    const request = new PurchaseInvoiceRequestPayload();
    request.ppId = rowData.id;
    this.ppName = rowData.code;
    this.purchaseInvoiceService.select(request).subscribe(res => {
      this.purchaseInvoiceData = res;
      this.isShowDialogPurchaseInvoice = true;
      this.cd.detectChanges();
    });
  }

  public onBtnSelectShipmentClick(rowData: any): void {
    const request = new ShipmentRequestPayload();
    request.ppId = rowData.id;
    request.hasPaging = false;
    this.ppName = rowData.code;
    this.shipmentService.select(request).subscribe(res => {
      this.shipmentData = res;
      this.isShowDialogShipment = true;
      this.cd.detectChanges();
    });
  }

}
