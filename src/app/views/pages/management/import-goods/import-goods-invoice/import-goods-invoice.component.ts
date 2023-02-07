import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { ImportGoodsService } from '../../../../../services/modules/import-goods';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './../import-goods.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { PurchaseInvoiceService } from '../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoiceItemService } from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { PurchaseInvoiceRequestPayload } from '../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { ImportGoodsInvoiceRequestPayload } from '../../../../../services/modules/import-goods/import-goods-invoice-request-payload';
import { DialogImportSyncErpComponent } from '../dialog-import-sync-erp/dialog-import-sync-erp.component';
import { OrganizationService } from '../../../../../services/modules/category/organization-management/organization/organization.service';
import { SubInventoryService } from '../../../../../services/modules/category/sub-inventory/sub-inventory.service';
import { SUB_INVENTORY } from '../../purchase-invoice/purchase-invoice-edit/purchase-invoice-edit.config';
import { HEADER_ORG } from '../../purchase-request/purchase-request.config';
import { TreeNode } from 'primeng/api';
import { SyncErpService } from '../../../../../services/modules/sync-erp/sync-erp.service';
import { SyncErpRequestPayload } from '../../../../../services/modules/sync-erp/sync-erp.request-payload';
import { TranslateService } from '@ngx-translate/core';
import { CustomConfirmation } from '../../../../../services/common/confirmation/custom-confirmation';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { Location } from '@angular/common';

@Component({
  selector: 'app-import-goods-invoice',
  templateUrl: './import-goods-invoice.component.html',
  styleUrls: ['./import-goods-invoice.component.scss']
})
export class ImportGoodsInvoiceComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;

  public activeIdTab: string;
  public tabs = config.IMPORT_TABS;
  public formData: FormDynamicData = new FormDynamicData();
  public cols: any[];
  public mainConfig = mainConfig.MAIN_CONFIG;
  public headerOrg = HEADER_ORG;
  public columnSubInventory = SUB_INVENTORY;
  public editTable: boolean;
  public dataModel: any = {};
  public frozenCols: any[];

  public dataSource: any = {
    items: [],
    itemsNotSrv: [],
    paginatorTotal: null,
    quantityTotal: 0,
    priceTotal: 0
  };
  public dataSourceItemOrigin = null;
  public currentUser: any = {};

  public isSelectAll = false;
  public dlgSyncErpRef: DialogRef = new DialogRef();
  @ViewChild('dialogReceipt2', { static: false }) dialogReceipt2: DialogImportSyncErpComponent;

  constructor(
    private translate: TranslateService,
    public purchaseInvoiceService: PurchaseInvoiceService,
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    public importGoodsService: ImportGoodsService,
    public notificationService: NotificationService,
    public organizationService: OrganizationService,
    public subInventoryService: SubInventoryService,
    public router: Router,
    private route: ActivatedRoute,
    public activatedRoute: ActivatedRoute,
    private location: Location,
    public cd: ChangeDetectorRef,
    private syncErpService: SyncErpService,
    private store: Store<AppState>
  ) {
    super();
    this.formData = {
      formId: 'purchase-plan-edit',
      icon: 'fal fa-shopping-cart',
      title: 'MENU.IMPORT_GOODS.INVOICE',
      service: this.importGoodsService,
      isCancel: true,
      hideHeader: false
    };

    this.store.pipe(select(currentUser)).subscribe(obj => {
      if (obj) {
        this.currentUser = obj;
      }
    });
  }

  ngOnInit() {
    // Xử lý frozenCols table
    const temp = JSON.stringify(config.COL_INVOICE_ITEM);
    this.cols = JSON.parse(temp);
    this.frozenCols = this.cols.slice(0, 6);
    this.cols.splice(0, 6);
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.initData(params);
      }
    });
    this.subscriptions.push(routeSub);
  }

  private onFragmentChanged(): void {
    this.activatedRoute.fragment.subscribe(fragment => {
      if (!fragment || !this.tabs.some(x => x.value === fragment)) {
        this.setFragmentToRoute('1');
      } else {
        if (fragment === '3' && (!this.dataModel.importStatus || this.dataModel.importStatus < 3)) {
          this.setFragmentToRoute('1');
        } else {
          this.activeIdTab = fragment;
        }
      }

      if (this.activeIdTab !== '1') {
        this.formData.isHideFooter = true;
      } else {
        if (!this.dataModel.syncErp || (this.dataModel.syncErp && this.dataModel.syncErp < 3)) {
          this.formData.isHideFooter = false;
        } else {
          this.formData.isHideFooter = true;
        }
      }
    });
  }

  private initData(params: any): void {
    const request = new PurchaseInvoiceRequestPayload();
    request.piId = params.id;
    const initData = forkJoin([
      this.purchaseInvoiceService.selectById(params.id),
      this.purchaseInvoiceItemService.select(request)
    ]).subscribe(res => {
      if (!res[0] || !res[0].id) {
        this.router.navigate([`list`], { relativeTo: this.route.parent });
      }
      this.dataModel = res[0];
      if (!this.dataModel) {
        this.redirectToParentPage();
      } else {
        this.onFragmentChanged();
      }
      this.dataSourceItemOrigin = res[1].map(x => {
        x.igOrgCode = x.orgCode;
        x.igSubInventory = x.igSubInventory ? x.igSubInventory : x.subInventory;
        return x;
      });
      this.dataSource = {
        items: this.dataSourceItemOrigin,
        paginatorTotal: res[1].length,
        quantityTotal: this.getSummary(res[1], 'quantity'),
        priceTotal: this.getSummaryAmount(res[1])
      };
      this.dataModel.summaryCorporateTax = this.getSummary(res[1], 'corporateTax');
      this.createItemDataTree();
      this.createItemDataTreeNotSrv();
      this.cd.detectChanges();
    });
    this.subscriptions.push(initData);
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  createItemDataTree() {
    const itemSourceTemp = this.dataSource.items;
    this.dataSource.items = [];
    const parentItems = itemSourceTemp.filter(x => !x.isSubItem);
    for (const parent of parentItems) {
      const node: TreeNode = {
        data: { ...parent },
        children: [],
        expanded: true,
        leaf: true
      };
      const childItems = itemSourceTemp.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
      for (const child of childItems) {
        const childNode = {
          data: { ...child },
          leaf: true,
        };
        node.children.push(childNode);
        node.leaf = false;
      }
      this.dataSource.items.push(node);
    }
    this.dataSource.paginatorTotal = this.dataSource.items.length;
    this.dataSource.items = [...this.dataSource.items];
  }

  createItemDataTreeNotSrv() {
    const itemSourceTemp = JSON.parse(JSON.stringify(this.dataSourceItemOrigin)).filter(x => !x.isUpdateSrv);
    this.dataSource.itemsNotSrv = [];

    const arr = [];
    let parentItems = itemSourceTemp.filter(x => !x.isSubItem);
    const childTemp = itemSourceTemp.filter(x => x.isSubItem);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < childTemp.length; i++) {
      let check = false;
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < parentItems.length; j++) {
        if (this.quote(childTemp[i].indexNo).startsWith(this.quote(parentItems[j].indexNo))) {
          check = true;
        }
      }
      if (!check) {
        arr.push(childTemp[i]);
      }
    }
    parentItems = parentItems.concat(arr); // Xử lý đoạn item cha là tích SRV mà item không phải tích SRV

    for (const parent of parentItems) {
      const node: TreeNode = {
        data: { ...parent },
        children: [],
        expanded: true,
        leaf: true
      };
      // tslint:disable-next-line:max-line-length
      const childItems = itemSourceTemp.filter(x => x.isSubItem && x.id !== parent.id && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
      for (const child of childItems) {
        const childNode = {
          data: { ...child },
          leaf: true,
        };
        node.children.push(childNode);
        node.leaf = false;
      }
      this.dataSource.itemsNotSrv.push(node);
    }
    this.dataSource.itemsNotSrv = [...this.dataSource.itemsNotSrv];
  }

  public getSummary(source: any[], type: string): number {
    let result = 0;
    if (source) {
      result = source
        .map(x => x[type])
        .filter(x => !isNaN(x))
        .reduce((a: number, b: number) => a + b, 0);
    }

    return result;
  }

  public getSummaryAmount(source: any[]): number {
    let result = 0;
    if (source) {
      result = source
        .map(x => x.price * x.quantity)
        .filter(x => !isNaN(x))
        .reduce((a: number, b: number) => a + b, 0);
    }

    return result;
  }

  public onBtnSaveClick(): void {
    if (this.activeIdTab === '1') {
      const request = new ImportGoodsInvoiceRequestPayload();
      request.note = this.dataModel.igNote;
      request.piItems = this.getListItemSave();

      this.importGoodsService.saveDraftImportInvoice(this.dataModel.id, request)
        .subscribe(() => {
          this.form.form.markAsPristine();
          this.notificationService.showSuccess();
        });
    }
  }

  public getListItemSave(): any {
    const arrItemSave = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      const item = this.dataSource.items[i];
      arrItemSave.push(item.data);
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          arrItemSave.push(children.data);
        }
      }
    }
    return arrItemSave;
  }

  public onBtnCancelClick(): void {
    // this.redirectToParentPage();
    this.location.back();
  }

  private redirectToParentPage(): void {
    this.router.navigate([`invoice`], { relativeTo: this.activatedRoute.parent });
  }

  public onEditData(): void {
    if (this.form) {
      this.form.form.markAsDirty();
    }
  }

  public setFragmentToRoute(tabId: any): void {
    this.router.navigate([], {
      fragment: tabId
    });
  }

  public goToViewAllocation() {
    this.setFragmentToRoute('3');
  }

  public onBtnSyncErpStep2Click(): void {
    if (this.form.dirty) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_003');
      return;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      const item = this.dataSource.items[i];
      if (!item.data.isUpdateSrv && !item.data.igSubInventory) {
        this.notificationService.showWarning('VALIDATION.IMPORT_GOODS.MSG_001');
        return;
      }
      if (item.data.itemType === 'SRV' && item.data.isUpdateSrv === true && !item.data.termAccount) {
        this.notificationService.showWarning('VALIDATION.IMPORT_GOODS.MSG_003');
        return;
      }
      if (!item.data.itemCode) {
        this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_002');
        return;
      }
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          if (!children.data.isUpdateSrv && !children.data.igSubInventory) {
            this.notificationService.showWarning('VALIDATION.IMPORT_GOODS.MSG_001');
            return;
          }
          if (children.data.itemType === 'SRV' && children.data.isUpdateSrv === true && !children.data.termAccount) {
            this.notificationService.showWarning('VALIDATION.IMPORT_GOODS.MSG_003');
            return;
          }
          if (!children.data.itemCode) {
            this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_002');
            return;
          }
        }
      }
    }

    const requestSyncErp = new SyncErpRequestPayload();
    requestSyncErp.piId = this.dataModel.id;
    this.syncErpService.checkAllowReceipt(requestSyncErp).subscribe(m => {
      if (m) {
        this.dlgSyncErpRef.config.style = { width: '90%' };
        this.dlgSyncErpRef.config.title = this.translate.instant('SYNC_ERP.CONFIRM_IMPORT');
        this.dlgSyncErpRef.config.hideBtnCancel = true;
        this.dialogReceipt2.initData();
        this.dlgSyncErpRef.show();
        this.cd.detectChanges();
      } else {
        this.purchaseInvoiceService.selectById(this.dataModel.id).subscribe(res => {
          this.dataModel = res;
          this.notificationService.showWarning('Vui lòng thử lại sau ít phút');
        });
      }
    });
  }

  public onBtnSyncErpStep2ViewClick(): void {
    this.dlgSyncErpRef.config.style = { width: '90%' };
    this.dlgSyncErpRef.config.title = this.translate.instant('SYNC_ERP.VIEW_INFORMATION_SYNC_ERP');
    this.dlgSyncErpRef.input.viewInfoSyncErp = true;
    this.dialogReceipt2.onViewDialogSyncErp();
    this.dlgSyncErpRef.show();
    this.cd.detectChanges();
  }

  public pushReceipt2Success(currentUserId): void {
    if (currentUserId) {
      this.purchaseInvoiceService.selectById(this.dataModel.id).subscribe(res => {
        if (res) {
          this.dataModel = res;
          this.purchaseInvoiceService.merge(res).subscribe(m => {
            this.notificationService.showSuccess();
            this.cd.detectChanges();
          });
        }
      });
    }
  }

  public pushReceipt2Error(currentUserId): void {
    if (currentUserId) {
      this.purchaseInvoiceService.selectById(this.dataModel.id).subscribe(res => {
        if (res) {
          this.dataModel = res;
          this.cd.detectChanges();
        }
      });
    }
  }

  public onChangeSubInventoryCode(subInventoryDto: any, rowData: any) {
    if (subInventoryDto && typeof subInventoryDto === 'object') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.dataSource.items.length; i++) {
        if (this.dataSource.items[i].data.igOrgCode === rowData.igOrgCode && this.dataSource.items[i].data.poId === rowData.poId) {
          // tslint:disable-next-line:max-line-length
          this.dataSource.items[i].data.igSubInventory = this.dataSource.items[i].data.igSubInventory && typeof this.dataSource.items[i].data.igSubInventory === 'object' ? this.dataSource.items[i].data.igSubInventory : subInventoryDto.code;
        }
        if (this.dataSource.items[i].children && this.dataSource.items[i].children.length > 0) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.dataSource.items[i].children.length; j++) {
            // tslint:disable-next-line:max-line-length
            if (this.dataSource.items[i].children[j].data.igOrgCode === rowData.igOrgCode && this.dataSource.items[i].children[j].data.poId === rowData.poId) {
              // tslint:disable-next-line:max-line-length
              this.dataSource.items[i].children[j].data.igSubInventory = this.dataSource.items[i].children[j].data.igSubInventory && typeof this.dataSource.items[i].children[j].data.igSubInventory === 'object' ? this.dataSource.items[i].children[j].data.igSubInventory : subInventoryDto.code;
            }
          }
        }
      }
      rowData.igSubInventory = subInventoryDto.code;
    }
    this.onEditData();
  }

  public returnReceipt() {
    const confirmation = new CustomConfirmation('SYNC_ERP.CONFIRM_RETURN_MESSAGE');
    confirmation.accept = () => {
      const request: any = {
        piId: this.dataModel.id
      };
      this.syncErpService.returnReceipt(request).subscribe(m => {
        if (m) {
          this.initData({ id: this.dataModel.id });
          this.notificationService.showSuccess();
          this.cd.detectChanges();
        }
      });
    };
    this.notificationService.confirm(confirmation);
  }

  public viewLogReceipt() {
    const request: any = {
      piId: this.dataModel.id
    };
    this.syncErpService.viewLogReceipt(request).subscribe(m => {
      console.log(m);
    });
  }
}
