import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import * as config from './shipment-view.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { ShipmentItemRequestPayload } from '../../../../../services/modules/shipment-item/shipment-item.request-payload';
import { forkJoin } from 'rxjs';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';
import { ShipmentItemService } from '../../../../../services/modules/shipment-item/shipment-item.service';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { ShipmentPackageService } from '../../../../../services/modules/shipment-package/shipment-package.service';
import { ShipmentPackageRequestPayload } from '../../../../../services/modules/shipment-package/shipment-package.request-payload';
import { TreeNode } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { PurchaseInvoiceService } from '../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { PurchaseAttachmentRequestPayload } from '../../../../../services/modules/purchase-attachment/purchase-attachment.request.payload';
import { PurchaseAttachmentService } from '../../../../../services/modules/purchase-attachment/purchase-attachment.service';
import { SyncErpRequestPayload } from '../../../../../services/modules/sync-erp/sync-erp.request-payload';
import { SyncErpService } from '../../../../../services/modules/sync-erp/sync-erp.service';
import { ShipmentExportService } from '../../../../../services/modules/shipment-export/shipment-export.service';
import { ShipmentItemComponent } from '../shipment-edit/shipment-item/shipment-item.component';
import { FileService } from '../../../../../services/modules/file/file.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-shipment-view',
  templateUrl: './shipment-view.component.html',
  styleUrls: ['./shipment-view.component.scss']
})
export class ShipmentViewComponent extends BaseFormComponent implements OnInit {
  @ViewChild('packageListInfo', { static: false }) packageListInfo: any;
  @ViewChild('shipmentItem', { static: false }) shipmentItem: ShipmentItemComponent;

  public shipmentStatus = config.SHIPMENT_STATUS;
  public profileStatus = config.PROFILE_STATUS;
  public importforms = config.IMPORT_FORM;
  public statusOrc = config.STATUS_ORC;

  public mainConfig: any;
  public shipmentData: any;
  public shipmentItemData: any = {
    items: [],
    paginatorTotal: null
  };
  public shipmentPackageData: any = {};
  public currentShipmentId: string;
  public checkDeliveryRecords = false;
  public checkAllowReceiptB2Shipment = false;
  public isShowExport = false;

  public listPpHasFile = [];
  public listPrHasFile = [];
  public listPoHasFile = [];
  public listPiHasFile = [];

  constructor(
    public shipmentService: ShipmentService,
    private shipmentItemService: ShipmentItemService,
    public shipmentPackageService: ShipmentPackageService,
    private syncErpService: SyncErpService,
    public purchaseInvoiceService: PurchaseInvoiceService,
    public purchaseAttachmentService: PurchaseAttachmentService,
    public shipmentExportService: ShipmentExportService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private fileService: FileService
  ) {
    super();
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;

    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.currentShipmentId = params.id;
        this.getShipmentAttachment();
        this.initData(params.id);
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onDlgHide(): void {
    this.resetVariables();
  }

  private resetVariables(): void {
    this.shipmentData = null;
    this.shipmentItemData = null;
    this.shipmentPackageData = {};
  }
  /**
   * Initialize data
   */
  public initData(id: string): void {
    // Get shipment id from input dialog ref
    const shipmentId = id;
    const requestShipmentItem = new ShipmentItemRequestPayload();
    requestShipmentItem.shipmentId = shipmentId;
    const requestShipmentPackage = new ShipmentPackageRequestPayload();
    requestShipmentPackage.shipmentId = shipmentId;

    const categorySub = forkJoin([
      // Get shipment
      this.shipmentService.selectById(shipmentId),
      // Get shipment item
      this.shipmentItemService.select(requestShipmentItem),
      this.shipmentPackageService.select(requestShipmentPackage)
    ]).subscribe(res => {
      if (!res[0]) {
        this.router.navigate([`list`], { relativeTo: this.route.parent });
      }
      this.shipmentData = res[0];
      this.shipmentItemData = {
        items: res[1],
        paginatorTotal: res[1].length
      };
      this.shipmentPackageData.items = res[2];

      if (this.packageListInfo && this.shipmentPackageData.items.length > 0) {
        let itemQuantityTotal = 0;
        let volumeTotal = 0;
        let weightTotal = 0;
        let grossWeightTotal = 0;
        let packageQuantityTotal = 0;
        for (const item of this.shipmentPackageData.items) {
          itemQuantityTotal += +item.itemQuantity;
          volumeTotal += +item.volume;
          weightTotal += +item.weight;
          grossWeightTotal += +item.grossWeight;
          packageQuantityTotal += +item.packageQuantity;
        }
        this.packageListInfo.itemQuantityTotal = itemQuantityTotal;
        this.packageListInfo.volumeTotal = volumeTotal;
        this.packageListInfo.weightTotal = weightTotal;
        this.packageListInfo.grossWeightTotal = grossWeightTotal;
        this.packageListInfo.packageQuantityTotal = packageQuantityTotal;
      }
      this.getTotalItem();
      this.createItemDataTree();
      this.initObjectHasFile();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  private initObjectHasFile() {
    const requestPp: any = { shipmentId: this.shipmentData.id, fileModule: 'PP' };
    const requestPr: any = { shipmentId: this.shipmentData.id, fileModule: 'PR' };
    const requestPo: any = { shipmentId: this.shipmentData.id, fileModule: 'PO' };
    const requestPi: any = { shipmentId: this.shipmentData.id, fileModule: 'PI' };
    const initSub = forkJoin([
      this.fileService.selectObjectHasFileInModule(requestPp),
      this.fileService.selectObjectHasFileInModule(requestPr),
      this.fileService.selectObjectHasFileInModule(requestPo),
      this.fileService.selectObjectHasFileInModule(requestPi),
    ]).subscribe(res => {
      this.listPpHasFile = res[0];
      this.listPrHasFile = res[1];
      this.listPoHasFile = res[2];
      this.listPiHasFile = res[3];
    });
    this.subscriptions.push(initSub);
  }

  private quote(source: string): string {
    return `${source}.`;
  }

  createItemDataTree() {
    const itemSourceTemp = this.shipmentItemData.items;
    this.shipmentItemData.items = [];
    const parentItems = itemSourceTemp.filter(x => !x.isSubItem);
    for (const parent of parentItems) {
      const node: TreeNode = {
        data: { ...parent },
        children: [],
        expanded: true,
        leaf: true
      };
      const childItems = itemSourceTemp.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(parent.indexNo));
      for (const child of childItems) {
        const childNode = {
          data: { ...child },
          leaf: true,
        };
        node.children.push(childNode);
        node.leaf = false;
      }
      this.shipmentItemData.items.push(node);
    }
    this.shipmentItemData.items = [...this.shipmentItemData.items];
  }

  private getTotalItem(): void {
    if (this.shipmentData && this.shipmentItemData.items && this.shipmentItemData.items.length > 0) {
      let total = 0;
      let totalAmount = 0;
      for (const item of this.shipmentItemData.items) {
        total += +item.quantity;
        totalAmount += +item.quantity * +item.price;
      }
      this.shipmentData.totalAmount = totalAmount;
    } else {
      this.shipmentData.totalAmount = 0;
    }
  }

  public goBack() {
    this.location.back();
    // this.router.navigate([`list`], { relativeTo: this.route.parent });
  }

  public goEdit() {
    this.router.navigate([`../../edit/${this.shipmentData.id}`], { relativeTo: this.route });
  }

  public checkLicensedExport(): void {
    const request = new ShipmentItemRequestPayload();
    request.shipmentId = this.currentShipmentId;
    this.shipmentItemService.exportAll(request).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public getShipmentAttachment(): void {
    this.checkDeliveryRecords = false;
    let files = [];
    const request = new PurchaseAttachmentRequestPayload();
    request.recordId = this.currentShipmentId;
    request.module = 'SHIPMENT_ATTACHMENT';

    const requestSyncErp = new SyncErpRequestPayload();
    requestSyncErp.shipmentId = this.currentShipmentId;

    const subCheckData = forkJoin([
      this.purchaseAttachmentService.getPurchaseAttachment(request),
      this.syncErpService.checkAllowReceiptB2Shipment(requestSyncErp),
    ]).subscribe(res => {
      if (res) {
        files = res[0];
        files = files.filter(x => x.files);
        const obj = files.find(m => m.name === 'Biên bản bàn giao');
        if (obj) {
          this.checkDeliveryRecords = true;
        }
        this.checkAllowReceiptB2Shipment = res[1];
      }
    });
    this.subscriptions.push(subCheckData);
  }

  public checkListFile(data) {
    let docStatus = 1;
    const files = data.filter(x => x.files);
    if (files.length > 0) {
      const obj = files.find(m => m.name === 'Biên bản bàn giao');
      if (obj) {
        this.checkDeliveryRecords = true;
        docStatus = 3;
      } else {
        docStatus = 2;
      }
      this.shipmentService.selectById(this.currentShipmentId).subscribe(shipment => {
        if (shipment) {
          const dataUpdate: any = {
            ...shipment,
            docStatus
          };
          this.shipmentService.confirmGoodsToTheWarehouse(dataUpdate).subscribe(res => {
            this.shipmentData.docStatus = docStatus;
          });
        }
      });
    }
  }

  public exportRequestPayTax() {
    const request: any = { shipmentId: this.shipmentData.id };
    this.shipmentExportService.exportRequestPayTax(request).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

}
