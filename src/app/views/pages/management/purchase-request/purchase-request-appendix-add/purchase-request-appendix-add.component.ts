import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import * as parentConfig from '../purchase-request.config';
import * as config from './purchase-request-appendix-add.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { PurchaseRequestAppendixDialogComponent } from './purchase-request-appendix-dialog/purchase-request-appendix-dialog.component';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { PurchaseRequestService } from '../../../../../services/modules/purchase-request/purchase-request.service';
import { PurchaseRequestRequestPayload } from '../../../../../services/modules/purchase-request/purchase-request.request-payload';
import { DeleteConfirmation } from '../../../../../services/common/confirmation/delete-confirmation';

@Component({
  selector: 'app-purchase-request-appendix-add',
  templateUrl: './purchase-request-appendix-add.component.html',
  styleUrls: ['./purchase-request-appendix-add.component.scss']
})

export class PurchaseRequestAppendixAddComponent extends BaseComponent implements OnInit {
  @ViewChild('appendixDialog', { static: true }) appendixDialog: PurchaseRequestAppendixDialogComponent;
  public dialogRef: DialogRef = new DialogRef();
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request: any;
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public purchaseRequestData: any = {};
  public prContractInfo = parentConfig.PR_CONTRACT_INFO;
  public prTypeTemp = parentConfig.PR_TYPE;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    public purchaseRequestService: PurchaseRequestService
  ) {
    super();
  }

  ngOnInit() {
    this.request = new PurchaseRequestRequestPayload();
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.request.rootPrId = params.id;
        this.purchaseRequestService.selectById(params.id).subscribe(res => {
          this.purchaseRequestData = res;
          this.transformPurchaseRequestData(this.purchaseRequestData);
          this.initData();
        });
      }
    });
    this.subscriptions.push(routeSub);
  }

  public transformPurchaseRequestData(purchaseRequestData) {
    purchaseRequestData.amAccountItems = purchaseRequestData.amAccount ? purchaseRequestData.amAccount.split(',') : [];
    purchaseRequestData.pmAccountItems = purchaseRequestData.pmAccount ? purchaseRequestData.pmAccount.split(',') : [];
    if (purchaseRequestData.prType === 1 || purchaseRequestData.prType === 2) {
      purchaseRequestData.prTypeTemp = this.prTypeTemp[0].value;
    }
    if (purchaseRequestData.prType === 3) {
      purchaseRequestData.prTypeTemp = this.prTypeTemp[1].value;
    }
    this.onChangeSelectPrType(purchaseRequestData.prTypeTemp);
  }

  public initData(): void {
    if (!this.purchaseRequestData.rootPrId) {
      const dataSub = this.purchaseRequestService.selectAppendix(this.request).subscribe(res => {
        this.dataSource.items = res;
        this.cdr.detectChanges();
      });
      this.subscriptions.push(dataSub);
    } else {
      const dataSub = this.purchaseRequestService.selectById(this.purchaseRequestData.rootPrId).subscribe(res => {
        this.dataSource.items = [];
        this.dataSource.items.push(res);
        this.cdr.detectChanges();
      });
      this.subscriptions.push(dataSub);
    }
  }

  public onChangeSelectPrType(value: any) {
    this.prContractInfo = parentConfig.PR_CONTRACT_INFO;
    if (value) {
      if (+value === 1) {
        this.prContractInfo = this.prContractInfo.filter(m => m.value !== 3);
      }
      if (+value === 2) {
        this.prContractInfo = this.prContractInfo.filter(m => m.value === 3);
      }
      if (!this.purchaseRequestData.id) {
        this.purchaseRequestData.prType = null;
      }
    }
  }

  public onSuccess(data: any): any {
    this.initData();
    this.cdr.detectChanges();
  }

  public onBtnAddClick(): void {
    const params = {
      id: null,
      rowData: { ... this.purchaseRequestData }
    };
    params.rowData.rootPrId = params.rowData.id;
    this.dialogRef.input = params;
    this.dialogRef.config.style = { width: '80vw' };
    this.appendixDialog.status = 'add';
    this.appendixDialog.purchaseRequestData = params.rowData;
    this.appendixDialog.purchaseRequestData.prNoTemp = this.appendixDialog.purchaseRequestData.prNo + '/xxx';
    this.appendixDialog.requestItem.prId = this.purchaseRequestData.id;
    this.appendixDialog.selectedPurchaseRequestItems = [];
    this.appendixDialog.loadNodes();
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public onBtnEditClick(rowData: any): void {
    this.purchaseRequestService.selectById(rowData.id).subscribe(res => {
      rowData = res;
      this.transformPurchaseRequestData(rowData);
      const strRowData = JSON.stringify(rowData);
      const objRowData = JSON.parse(strRowData);
      const params = {
        id: objRowData.id,
        rowData: objRowData,
      };
      this.dialogRef.config.style = { width: '80vw' };
      this.dialogRef.input = params;
      this.appendixDialog.status = 'edit';
      this.appendixDialog.purchaseRequestData = params.rowData;
      this.appendixDialog.purchaseRequestData.prNoTemp = this.appendixDialog.purchaseRequestData.prNo;
      this.appendixDialog.requestItem.prId = rowData.id;
      this.appendixDialog.selectedPurchaseRequestItems = [];
      this.appendixDialog.loadNodes();
      this.dialogRef.show();
      this.cdr.detectChanges();
    });
  }

  public onBtnDeleteClick(rowData: any): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.purchaseRequestService
        .delete(rowData.id)
        .subscribe((res) => {
          this.notification.showSuccess();
          this.initData();
          this.cdr.detectChanges();
        });
    };
    this.notification.confirm(confirmation);
  }

}
