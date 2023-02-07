import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { PurchaseInvoiceRequestPayload } from '../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { PurchaseInvoiceService } from '../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import * as config from './purchase-invoice.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { CancelConfirmation } from '../../../../services/common/confirmation/cancel-confirmation';
import { ExportService } from '../../../../services/common/export';
import { InvoiceTypeService } from '../../../../services/modules/category/invoice-type/invoice-type.service';
import { SupplierSiteService } from '../../../../services/modules/category/supplier-site/supplier-site.service';
import { UserService } from '../../../../services/modules/user/user.service';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { ItemService } from '../../../../services/modules/category/item/item.service';
import { ShipmentService } from '../../../../services/modules/shipment/shipment.service';
import { MenuItem } from 'primeng/api';
import { ConfigListRequestPayload } from '../../../../services/modules/config-list/config-list.request.payload';
import { ConfigListService } from '../../../../services/modules/config-list/config-list.service';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';
import { ReceiptService } from '../../../../services/modules/receipt/receipt.service';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { MatPaginator } from '@angular/material';
@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss']
})
export class PurchaseInvoiceComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  @ViewChild('form', { static: true }) form: NgForm;

  btnItems: MenuItem[] = [
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.goToView(this.selectedRowData) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
    { label: 'Hủy', icon: 'pi pi-fw pi-times', command: () => this.onBtnCancelClick(this.selectedRowData) },
    { label: 'Lô hàng', icon: 'pi pi-fw pi-search', command: () => this.onBtnShipmentClick(this.selectedRowData) },
    { label: 'Theo dõi thanh toán', icon: 'far fa-money-check-alt', command: () => this.onBtnPaymentTracking(this.selectedRowData.id) },
    { label: 'Đề nghị thanh toán', icon: 'far fa-money-check-alt', command: () => this.onBtnPaymentOrder(this.selectedRowData) },
  ];
  selectedRowData: any;

  public dialogRef: DialogRef = new DialogRef();
  public toolbarModel: ToolbarModel;
  public cols: any;
  public arrInvoiceTypes = [];
  public arrSupplierSite = [];
  public arrCostTypes = [];

  public statusInvoices = config.STATUS_INVOICE;
  public checkImportGoods = config.CHECK_IMPORT_GOODS;
  public syncErp = config.SYNC_ERP;
  public syncErpList = config.SYNC_ERP_LIST;
  public elimStatus = config.ELIM_STATUS;
  public statusTaxs = config.STATUS_TAX;
  public isShowFilterInvoice = true;
  public isShowFilterMerchandise = true;
  public isShowdialogRef = false;
  public requestPurchaseInvoice: any = {};
  public frozenCols: any[];

  public mainConfig: any;
  public request: any = {};
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    public purchaseInvoiceService: PurchaseInvoiceService,
    public noticeService: NotificationService,
    public exportService: ExportService,
    public cdr: ChangeDetectorRef,
    public router: Router,
    private route: ActivatedRoute,
    public invoiceTypeService: InvoiceTypeService,
    public supplierSiteService: SupplierSiteService,
    public userService: UserService,
    public configListService: ConfigListService,
    public supplierService: SupplierService,
    public itemService: ItemService,
    public shipmentService: ShipmentService,
    public departmentService: DepartmentService,
    public receiptService: ReceiptService
  ) {
    super();
  }

  ngOnInit() {
    // Xử lý frozenCols table
    const temp = JSON.stringify(config.HEADER);
    this.cols = JSON.parse(temp);
    this.frozenCols = this.cols.slice(0, 3);
    this.cols.splice(0, 3);

    this.request = new PurchaseInvoiceRequestPayload();
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.configToolbar();
    if (window.history.state.purchaseRequestData) {
      this.request.prId = window.history.state.purchaseRequestData.id;
    }
    if (window.history.state.purchaseOrderData) {
      this.request.poId = window.history.state.purchaseOrderData.id;
    }
    this.initMasterData();
    this.initData();
    this.pagingData();
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
    }
    const requests = [
      this.purchaseInvoiceService.selectPost(this.request),
      this.purchaseInvoiceService.countPost(this.request)
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

  private initMasterData() {
    this.invoiceTypeService.select().subscribe(m => {
      this.arrInvoiceTypes = m;
    });
    this.supplierSiteService.selectDistinctCode().subscribe(m => {
      this.arrSupplierSite = m;
    });
    const requestConfigList = new ConfigListRequestPayload();
    requestConfigList.type = 'COST_TYPE';
    this.configListService.select(requestConfigList).subscribe(res => {
      this.arrCostTypes = res;
    });
  }

  public getCostTypeName(source: any[], code: string): string {
    const item = source.filter(x => x.code === code)[0];
    return item ? item.name : null;
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.add.routerLink = [`add`];
    this.toolbarModel.option.add.title = 'Thêm đề nghị thanh toán';
    this.toolbarModel.option.add.disabled = true;
    this.toolbarModel.option.export.click = () => this.exportAll();
    this.toolbarModel.option.save.show = false;
    this.toolbarModel.option.import.show = false;
    this.toolbarModel.option.update.show = false;
    this.toolbarModel.option.customize.show = false;
  }

  public exportAll(): void {
    // const exportModel = new ExportModel();
    // exportModel.description = 'Test export';
    // exportModel.source = this.dataSource.items;
    // exportModel.columns = [
    //   { bindLabel: 'invoice type', bindValue: 'invoiceType' },
    //   { bindLabel: 'created at', bindValue: 'createdAt', dataType: DataType.DateTime }
    // ];
    // this.exportService.export(this.request, 'p-invoice').subscribe(() => {
    //   this.noticeService.showMessage('Download complete');
    // });

    this.purchaseInvoiceService.exportAll(this.request).subscribe(() => {
      this.noticeService.showMessage('Download complete');
    });
  }

  public onSearch(): void {
    this.request = Object.assign(this.request, this.requestPurchaseInvoice);
    this.initData();
  }

  public onBtnResetSearchClick(): void {
    this.request = new PurchaseInvoiceRequestPayload();
    this.initData();
  }

  public goToView(rowData: any): void {
    this.router.navigate([`view/${rowData.id}`], { relativeTo: this.route });
  }

  public onBtnEditClick(id: string): void {
    this.router.navigate([`edit/${id}`], { relativeTo: this.route });
  }

  public onBtnPaymentTracking(id: string): void {
    this.router.navigate([`payment-tracking/${id}`], { relativeTo: this.route });
  }

  public onBtnPaymentOrder(rowData: any): void {
    if (rowData.expenseId) {
      // màn hình list
      this.router.navigate([`../payment-order/list/${rowData.id}`], { relativeTo: this.route });
    } else {
      // Form Add
      this.router.navigate([`../payment-order/add`],
        {
          relativeTo: this.route,
          queryParams: {
            piId: rowData.id
          }
        });
    }
  }

  public changeShowFilterInvoice() {
    this.isShowFilterInvoice = !this.isShowFilterInvoice;
    if (!this.isShowFilterInvoice) {
      this.request.invoiceType = null;
      this.request.invoiceTypeDto = null;
      this.request.code = null;
      this.request.createdBy = null;
      this.request.createdByDto = null;
      this.request.supplierTax = null;
      this.request.vendorId = null;
      this.request.vendorIdDto = null;
      this.request.fromDate = null;
      this.request.toDate = null;
      this.request.costType = null;
      this.request.status = null;
      this.request.syncStatus = null;
      this.request.statusTax = null;
    }
  }

  public changeShowFilterMerchandise() {
    this.isShowFilterMerchandise = !this.isShowFilterMerchandise;
    if (!this.isShowFilterMerchandise) {
      this.request.itemCode = null;
      this.request.itemCodeDto = null;
      this.request.partNo = null;
      this.request.itemName = null;
      this.request.itemType = null;
      this.request.poCode = null;
      this.request.waybillNumber = null;
      this.request.waybillNumberDto = null;
      this.request.hasTermAccount = null;
    }
  }

  public onBtnCancelClick(rowData: any): void {
    const confirmation = new CancelConfirmation('content');
    confirmation.accept = () => {
      // get lại hóa đơn để tránh mất thông tin khi ở trạng thái hủy
      this.purchaseInvoiceService.selectById(rowData.id).subscribe(res => {
        res.status = this.statusInvoices[0].value;
        this.purchaseInvoiceService.merge(res).subscribe(() => {
          this.noticeService.showSuccess();
          this.initData();
          this.cdr.detectChanges();
        });
      });
    };
    this.noticeService.confirm(confirmation);
  }

  public onShowContextMenu() {
    this.btnItems[1].visible = !this.selectedRowData.syncStatus || this.selectedRowData.syncStatus < this.syncErp[1].value;
    this.btnItems[2].visible = !this.selectedRowData.syncStatus || this.selectedRowData.syncStatus < this.syncErp[1].value;
  }

  public onBtnShipmentClick(rowData: any): void {
    this.router.navigate([`../../shipment/list`],
      {
        relativeTo: this.route,
        state: {
          purchaseInvoiceData: rowData
        }
      });
  }


}
