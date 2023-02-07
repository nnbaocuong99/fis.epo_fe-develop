import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { ImportGoodsService } from '../../../../../services/modules/import-goods';
import { ShipmentItemRequestPayload } from '../../../../../services/modules/shipment-item/shipment-item.request-payload';
import { ShipmentItemService } from '../../../../../services/modules/shipment-item/shipment-item.service';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './../import-goods.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { CustomConfirmation } from '../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { OrganizationRequestPayload } from '../../../../../services/modules/org-chart/org-chart-request.payload';
import { OrganizationService } from '../../../../../services/modules/category/organization-management/organization/organization.service';
import { HEADER_ORG } from '../../purchase-request/purchase-request.config';
import { DialogImportSyncErpComponent } from '../dialog-import-sync-erp/dialog-import-sync-erp.component';
import { SubInventoryService } from '../../../../../services/modules/category/sub-inventory/sub-inventory.service';
import { SUB_INVENTORY } from '../../purchase-invoice/purchase-invoice-edit/purchase-invoice-edit.config';
import { TreeNode } from 'primeng/api';
import { SyncErpRequestPayload } from '../../../../../services/modules/sync-erp/sync-erp.request-payload';
import { SyncErpService } from '../../../../../services/modules/sync-erp/sync-erp.service';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { Location } from '@angular/common';

@Component({
  selector: 'app-import-goods-shipment',
  templateUrl: './import-goods-shipment.component.html',
  styleUrls: ['./import-goods-shipment.component.scss']
})
export class ImportGoodsShipmentComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('dialogReceipt2', { static: false }) dialogReceipt2: DialogImportSyncErpComponent;

  public activeIdTab: string;
  public tabs = config.IMPORT_TABS;
  public formData: FormDynamicData = new FormDynamicData();
  public cols: any[];
  public mainConfig = mainConfig.MAIN_CONFIG;
  public headerOrg = HEADER_ORG;
  public columnSubInventory = SUB_INVENTORY;
  public editTable: boolean;
  public dataModel: any = {};
  public dataSource: any = {
    items: [],
    itemsNotSrv: [],
    paginatorTotal: null,
    quantityTotal: 0,
    priceTotal: 0
  };
  public dataSourceItemOrigin = null;
  public currentUser: any = {};

  public checkAllowReceiptB2Shipment = false;
  public frozenCols: any[];
  public isSelectAll = false;
  public dlgSyncErpRef: DialogRef = new DialogRef();
  public organizationRequestPayload = new OrganizationRequestPayload();

  constructor(
    private translate: TranslateService,
    public shipmentService: ShipmentService,
    public shipmentItemService: ShipmentItemService,
    public importGoodsService: ImportGoodsService,
    public notificationService: NotificationService,
    public organizationService: OrganizationService,
    public subInventoryService: SubInventoryService,
    private location: Location,
    private syncErpService: SyncErpService,
    public router: Router,
    private route: ActivatedRoute,
    public activatedRoute: ActivatedRoute,
    public cd: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    super();
    this.formData = {
      formId: 'purchase-plan-edit',
      icon: 'fal fa-shopping-cart',
      title: 'MENU.IMPORT_GOODS.SHIPMENT',
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
    const temp = JSON.stringify(config.COL_SHIPMENT_ITEM);
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
    const requestShipmentItem = new ShipmentItemRequestPayload();
    requestShipmentItem.shipmentId = params.id;

    const requestSyncErp = new SyncErpRequestPayload();
    requestSyncErp.shipmentId = params.id;

    const initData = forkJoin([
      this.shipmentService.selectById(params.id),
      this.shipmentItemService.select(requestShipmentItem),
      this.syncErpService.checkAllowReceiptB2Shipment(requestSyncErp),
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
      this.checkAllowReceiptB2Shipment = res[2];
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
    const itemSourceTemp = JSON.parse(JSON.stringify(this.dataSourceItemOrigin));
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

  /**
   * Get summary on column
   * @param type: name of column get sum
   */
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

  /**
   * Get summary on column
   * @param type: name of column get sum
   */
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
    this.importGoodsService.saveDraftImportShipment(this.dataModel.id, this.getListItemSave())
      .subscribe(() => {
        this.form.form.markAsPristine();
        this.notificationService.showSuccess();
      });
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
    this.router.navigate([`shipment`], { relativeTo: this.activatedRoute.parent });
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
    if (!this.checkAllowReceiptB2Shipment) {
      this.notificationService.showWarning('Hiện tại chưa thế thực hiện đồng bộ Receipt bước 2');
      return;
    }

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
      if (!item.data.itemCode) {
        this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_005');
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
          if (!children.data.itemCode) {
            this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_005');
            return;
          }
        }
      }
    }

    this.dlgSyncErpRef.config.style = { width: '90%' };
    this.dlgSyncErpRef.config.title = this.translate.instant('SYNC_ERP.CONFIRM_RECEIPT_STEP_2');
    this.dialogReceipt2.initData();
    this.dlgSyncErpRef.show();
    this.cd.detectChanges();
  }

  public onBtnSyncErpStep2ViewClick(): void {
    this.dlgSyncErpRef.config.style = { width: '90%' };
    this.dlgSyncErpRef.config.title = this.translate.instant('SYNC_ERP.VIEW_INFORMATION_SYNC_ERP');
    this.dlgSyncErpRef.input.viewInfoSyncErp = true;
    this.dlgSyncErpRef.config.hideBtnCancel = true;
    this.dialogReceipt2.onViewDialogSyncErp();
    this.dlgSyncErpRef.show();
    this.cd.detectChanges();
  }

  public pushReceipt2Success(currentUserId): void {
    if (currentUserId) {
      this.shipmentService.selectById(this.dataModel.id).subscribe(res => {
        if (res) {
          this.dataModel = res;
          this.shipmentService.merge(res).subscribe(m => {
            this.notificationService.showSuccess();
            this.cd.detectChanges();
          });
        }
      });
    }
  }

  public pushReceipt2Error(currentUserId): void {
    if (currentUserId) {
      this.shipmentService.selectById(this.dataModel.id).subscribe(res => {
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
          this.dataSource.items[i].data.igSubInventory = this.dataSource.items[i].data.igSubInventory && typeof this.dataSource.items[i].data.igSubInventory !== 'object' ? this.dataSource.items[i].data.igSubInventory : subInventoryDto.code;
        }
        if (this.dataSource.items[i].children && this.dataSource.items[i].children.length > 0) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.dataSource.items[i].children.length; j++) {
            // tslint:disable-next-line:max-line-length
            if (this.dataSource.items[i].children[j].data.igOrgCode === rowData.igOrgCode && this.dataSource.items[i].children[j].data.poId === rowData.poId) {
              // tslint:disable-next-line:max-line-length
              this.dataSource.items[i].children[j].data.igSubInventory = this.dataSource.items[i].children[j].data.igSubInventory && typeof this.dataSource.items[i].children[j].data.igSubInventory !== 'object' ? this.dataSource.items[i].children[j].data.igSubInventory : subInventoryDto.code;
            }
          }
        }
      }
      rowData.igSubInventory = subInventoryDto.code;
    }
    this.onEditData();
  }

  public onChangeIgNote(rowData: any) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      if (!this.dataSource.items[i].data.igNote) {
        this.dataSource.items[i].data.igNote = rowData.igNote;
      }
      if (this.dataSource.items[i].children && this.dataSource.items[i].children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.dataSource.items[i].children.length; j++) {
          if (!this.dataSource.items[i].children[j].data.igNote) {
            this.dataSource.items[i].children[j].data.igNote = rowData.igNote;
          }
        }
      }
    }
    this.onEditData();
  }

  public returnReceipt() {
    const confirmation = new CustomConfirmation('SYNC_ERP.CONFIRM_RETURN_MESSAGE');
    confirmation.accept = () => {
      const request: any = {
        shipmentId: this.dataModel.id
      };
      this.syncErpService.returnReceipt(request).subscribe(m => {
        if (m) {
          this.redirectToParentPage();
          this.notificationService.showSuccess();
          this.cd.detectChanges();
        }
      });
    };
    this.notificationService.confirm(confirmation);
  }

  public viewLogReceipt() {
    const request: any = {
      shipmentId: this.dataModel.id
    };
    this.syncErpService.viewLogReceipt(request).subscribe(m => {
      console.log(m);
    });
  }

}
