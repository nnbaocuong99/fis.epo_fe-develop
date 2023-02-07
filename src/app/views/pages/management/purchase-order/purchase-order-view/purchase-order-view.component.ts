import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';
import * as config from './purchase-order-view.config';
import * as configParent from '../purchase-order.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDownload } from '../../../../partials/control/download-file/download-file.component';
import { FileService } from '../../../../../services/modules/file/file.service';
import { FileRequestPayload } from '../../../../../services/modules/file/file.request.payload';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { BpmService } from '../../../../../services/modules/s-pro/bpm.service';
import { PurchaseOrderHistoryComponent } from '../purchase-order-history/purchase-order-history.component';
import { AppendixAddComponent } from '../appendix-add/appendix-add.component';
import { BusinessProcessManagementComponent } from '../../../../partials/business-process-management/business-process-management.component';
import { PurchaseOrderRequestPayload } from '../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { Location } from '@angular/common';
@Component({
  selector: 'app-purchase-order-view',
  templateUrl: './purchase-order-view.component.html',
  styleUrls: ['./purchase-order-view.component.scss']
})
export class PurchaseOrderViewComponent extends BaseFormComponent implements OnInit {
  @ViewChild('bpm', { static: false }) bpm: BusinessProcessManagementComponent;
  @ViewChild('purchaseOrderItem', { static: false }) purchaseOrderItem: any;
  @ViewChild('purchaseOrderHistory', { static: false }) purchaseOrderHistory: PurchaseOrderHistoryComponent;
  @ViewChild('appendix', { static: true }) appendix: AppendixAddComponent;
  public poStatus = configParent.PO_STATUS;
  public purchaseOrder: any = {};
  public productTypes = config.PRODUCT_TYPES;
  public valueTypes = config.VALUE_TYPES;
  public areaTypeInternal = config.AREA_TYPE_INTERNAL;
  public areaTypeExternal = config.AREA_TYPE_EXTERNAL;
  public areaTypes = config.AREA_TYPE_INTERNAL;
  public taxPayers = config.TAX_PAYERS;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public arrBuyInternalUse = configParent.BUY_INTERNAL_USE;
  public isInternal = true;
  public isShowTableItem = false;
  public currentPoId: string;
  // Folder attach
  public purchaseOrderFolder: string;
  public file: any;

  public listPpHasFile = [];
  public listPrHasFile = [];

  constructor(
    public purchaseOrderService: PurchaseOrderService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private location: Location,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.initData(params.id);
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onDlgHide(): void {
    this.resetVariables();
  }

  private resetVariables(): void {
    this.purchaseOrder = {};
    this.isInternal = true;
    this.isShowTableItem = false;
  }

  public onSuccess() {
    this.cdr.detectChanges();
  }
  /**
   * Initialize data
   */
  public initData(id: string): void {
    this.isShowTableItem = false;
    // Get purchase order id from input dialog ref
    this.currentPoId = id;

    const requestFile = new FileRequestPayload();
    requestFile.module = 'Attachment\\PurchaseOrder\\' + this.currentPoId;

    const categorySub = forkJoin([
      // Get purchase order
      this.purchaseOrderService.selectById(this.currentPoId),
      this.fileService.select(requestFile),
    ]).subscribe(res => {
      if (!res[0]) {
        this.router.navigate([`list`], { relativeTo: this.route.parent });
      }
      this.purchaseOrder = res[0];
      if (res[1] && res[1].length > 0) {
        this.file = res[1][0];
      }
      if (this.purchaseOrder.areaType === 3 || this.purchaseOrder.areaType === 4) {
        this.areaTypes = this.areaTypeExternal;
        this.isInternal = false;
        this.isShowTableItem = true;
        // Folder attachment
        this.purchaseOrderFolder = 'PurchaseOrderExternal';
      } else {
        this.areaTypes = this.areaTypeInternal;
        this.isInternal = true;
        this.isShowTableItem = true;
        // Folder attachment
        this.purchaseOrderFolder = 'PurchaseOrderInternal';
      }
      this.initObjectHasFile();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  private initObjectHasFile() {
    const requestPp: any = { poId: this.purchaseOrder.id, fileModule: 'PP' };
    const requestPr: any = { poId: this.purchaseOrder.id, fileModule: 'PR' };
    const initSub = forkJoin([
      this.fileService.selectObjectHasFileInModule(requestPp),
      this.fileService.selectObjectHasFileInModule(requestPr)
    ]).subscribe(res => {
      this.listPpHasFile = res[0];
      this.listPrHasFile = res[1];
    });
    this.subscriptions.push(initSub);
  }

  public goBack() {
    this.location.back();
    // this.router.navigate([`list`], { relativeTo: this.route.parent });
  }

  public goEdit() {
    this.router.navigate([`../../edit/${this.purchaseOrder.id}`], { relativeTo: this.route });
  }

  public goPaymentTracking() {
    this.router.navigate([`../../payment-tracking/${this.purchaseOrder.id}`], { relativeTo: this.route });
  }

  public onBtnDownloadClick(): void {
    if (this.file && this.file.id) {
      const fileDownload = new FileDownload();
      fileDownload.id = this.file.id;
      fileDownload.name = this.file.name;
      this.fileService.download(fileDownload);
    }
  }

  public viewHistory(): void {
    this.purchaseOrderHistory.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

  public onBtnCreateTicket(): void {
    if (!this.file) {
      this.notificationService.showWarning('Vui lòng đính kèm thông tin hợp đồng.');
      return;
    }
    if (this.bpm) {
      this.purchaseOrder.totalAmount = this.purchaseOrderItem.purchaseOrderItemTotalAmounts.totalWithTax;
      this.bpm.isShowCreateTicketTemplate = true;
    }
  }

  public createTicketSuccess(sproDraftTicketId: number): void {
    if (sproDraftTicketId) {
      this.purchaseOrder.sproDraftTicketId = sproDraftTicketId;
      this.purchaseOrder.sproTicketId = null;
    }
  }

  public updateStatus(status: number): void {
    this.purchaseOrder.status = status;
    this.purchaseOrderService.merge(this.purchaseOrder).subscribe();
  }

  public onBtnExportExcelPO(): void {
    const request = new PurchaseOrderRequestPayload();
    request.id = this.purchaseOrder.id;
    this.purchaseOrderService.exportAll(request, this.purchaseOrder.code).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public onBtnExportContract(): void {
    const request = new PurchaseOrderRequestPayload();
    request.id = this.purchaseOrder.id;
    this.purchaseOrderService.exportContract(request, this.purchaseOrder.code).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

}
