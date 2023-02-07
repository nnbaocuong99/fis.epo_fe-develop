import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { ImportGoodsDto, ImportGoodsRequestPayload, ImportGoodsService } from '../../../../../services/modules/import-goods';
import { ToolbarModel } from '../../../../partials/content/toolbar/toolbar.model';
import * as config from '../import-goods.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import * as configShipment from '../../shipment/shipment.config';
import * as configInvoice from '../../purchase-invoice/purchase-invoice.config';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { ShipmentRequestPayload } from '../../../../../services/modules/shipment/shipment.request-payload';
import { PurchaseInvoiceRequestPayload } from '../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';
import { ItemService } from '../../../../../services/modules/category/item/item.service';
import { UserService } from '../../../../../services/modules/user/user.service';
import { InvoiceTypeService } from '../../../../../services/modules/category/invoice-type/invoice-type.service';
import { SupplierSiteService } from '../../../../../services/modules/category/supplier-site/supplier-site.service';
import { ConfigListRequestPayload } from '../../../../../services/modules/config-list/config-list.request.payload';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { MatPaginator } from '@angular/material';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { merge } from 'lodash';
import { tap } from 'rxjs/internal/operators/tap';
import { DepartmentService } from '../../../../../services/modules/category/department/department.service';

@Component({
  selector: 'app-import-goods-list',
  templateUrl: './import-goods-list.component.html',
  styleUrls: ['./import-goods-list.component.scss']
})
export class ImportGoodsListComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  public formTitle: string;
  public toolbarModel = new ToolbarModel();
  public statusImportGoods = config.STATUS_IMPORT_GOODS;
  public statusElim = config.ELIMSTATUS_ELIM_STATUS;
  public tabs = config.TABS;
  public activeIdTab: number;
  public request: any;
  public selectedImportGoodsItems: any = [];

  public isShowFilterShipment = true;
  public isShowFilterMerchandiseService = true;
  public profileStatus = configShipment.PROFILE_STATUS;
  public shipmentStatus = configShipment.SHIPMENT_STATUS;
  public importForms = configShipment.IMPORT_FORM;
  public isShowFilterInvoice = true;
  public isShowFilterMerchandise = true;
  public arrSupplierSite = [];
  public arrInvoiceTypes = [];
  public arrCostTypes = [];
  public statusInvoices = configInvoice.STATUS_INVOICE;
  public syncErp = configInvoice.SYNC_ERP;
  public statusTaxs = configInvoice.STATUS_TAX;

  public headers = [];
  public mainConfig: any;
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    public cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public importGoodsService: ImportGoodsService,
    public supplierService: SupplierService,
    public notificationService: NotificationService,
    public shipmentService: ShipmentService,
    public itemService: ItemService,
    public userService: UserService,
    public invoiceTypeService: InvoiceTypeService,
    public supplierSiteService: SupplierSiteService,
    public configListService: ConfigListService,
    public departmentService: DepartmentService
  ) {
    super();
  }

  ngOnInit() {
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

    this.setDefaultConfig();
    this.onParamsChanged(() => {
      this.configToolbar();
      this.onQueryParamsChanged();
    });
    this.pagingData();
  }

  private setDefaultConfig(): void {
    this.request = new ImportGoodsRequestPayload();
    this.request.shipment = new ShipmentRequestPayload();
    this.request.invoice = new PurchaseInvoiceRequestPayload();
    this.mainConfig = mainConfig.MAIN_CONFIG;
  }

  private setParamsToRoute(type: string): void {
    this.router.navigate([`import-goods/${type}`], { relativeTo: this.activatedRoute.parent });
  }

  public setQueryParamsToRoute(event: any): void {
    if (event.nextId && this.statusImportGoods.some(x => x.value.toString() === event.nextId)) {
      // Case 1: When query params has valid value
      this.router.navigate([], {
        queryParams: {
          status: event.nextId
        }
      });
    } else {
      // Case 2: When query params is null
      this.router.navigate([]);
    }
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.add.show = false;
  }

  private onQueryParamsChanged(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (!!params.status && this.statusImportGoods.some(x => x.value.toString() === params.status)) {
        this.request.importStatus = params.status;
        this.activeIdTab = params.status;
      } else {
        this.request.importStatus = null;
        this.activeIdTab = 0;
        this.router.navigate([]);
      }
      this.initData();
    });
  }

  private onParamsChanged(callback: () => void): void {
    const routeSub = this.activatedRoute.data.subscribe((data) => {
      if (data.type === 'shipment') {
        this.request.type = 1;
        this.headers = config.COL_SHIPMENT;
        this.formTitle = 'IMPORT_GOODS.HEADER_LIST_SHIPMENT';
      } else if (data.type === 'invoice') {
        this.request.type = 2;
        this.headers = config.COL_INVOICE;
        this.formTitle = 'IMPORT_GOODS.HEADER_LIST_INVOICE';
      } else {
        this.request.type = 1;
        this.headers = config.COL_SHIPMENT;
        this.formTitle = 'IMPORT_GOODS.HEADER_LIST_SHIPMENT';
        this.setParamsToRoute('shipment');
      }
      callback();
    });
    this.subscriptions.push(routeSub);
  }

  public onBtnImportClick(rowData: ImportGoodsDto): void {
    if (rowData.importStatus !== 1 && rowData.importStatus !== 2) {
      return;
    }
    this.router.navigate([`${rowData.id}`], {
      relativeTo: this.activatedRoute,
      fragment: '1'
    });
  }

  public onBtnAllocationClick(rowData: ImportGoodsDto) {
    if (rowData.importStatus < 3) {
      return;
    }
    this.router.navigate([`${rowData.id}`], {
      relativeTo: this.activatedRoute,
      fragment: '3'
    });
  }

  public changeShowFilterShipment() {
    this.isShowFilterShipment = !this.isShowFilterShipment;
  }

  public changeShowFilterMerchandiseService() {
    this.isShowFilterMerchandiseService = !this.isShowFilterMerchandiseService;
  }

  public onSearch(): void {
    this.initData();
  }

  public onReset(): void {
    if (this.request.type === 1) {
      this.request.shipment = new ShipmentRequestPayload();
    } else {
      this.request.invoice = new PurchaseInvoiceRequestPayload();
    }
    this.initData();
  }

  public changeShowFilterInvoice() {
    this.isShowFilterInvoice = !this.isShowFilterInvoice;
    if (!this.isShowFilterInvoice) {
      this.request.invoice.invoiceType = null;
      this.request.invoice.invoiceTypeDto = null;
      this.request.invoice.code = null;
      this.request.invoice.createdBy = null;
      this.request.invoice.createdByDto = null;
      this.request.invoice.supplierTax = null;
      this.request.invoice.vendorId = null;
      this.request.invoice.vendorIdDto = null;
      this.request.invoice.fromDate = null;
      this.request.invoice.toDate = null;
      this.request.invoice.costType = null;
      this.request.invoice.status = null;
      this.request.invoice.syncStatus = null;
      this.request.invoice.statusTax = null;
    }
  }

  public changeShowFilterMerchandise() {
    this.isShowFilterMerchandise = !this.isShowFilterMerchandise;
    if (!this.isShowFilterMerchandise) {
      this.request.invoice.itemCode = null;
      this.request.invoice.itemCodeDto = null;
      this.request.invoice.partNo = null;
      this.request.invoice.itemName = null;
      this.request.invoice.itemType = null;
      this.request.invoice.poCode = null;
      this.request.invoice.waybillNumber = null;
      this.request.invoice.waybillNumberDto = null;
    }
  }

  public initData(): void {
    if (this.paginator) {
      if (this.request.type === 1) {
        this.request.shipment.pageIndex = this.paginator.pageIndex;
        this.request.shipment.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
      } else {
        this.request.invoice.pageIndex = this.paginator.pageIndex;
        this.request.invoice.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
      }
    }
    const requests = [
      this.importGoodsService.selectPost(this.request),
      this.importGoodsService.countPost(this.request)
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

}
