import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { SaveConfirmation } from '../../../../../../services/common/confirmation/save-confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { IgEliminationDetailService } from '../../../../../../services/modules/ig-elimination-detail/ig-elimination-detail.service';
import { IgEliminationService } from '../../../../../../services/modules/ig-elimination/ig-elimination.service';
import { ImportGoodsService } from '../../../../../../services/modules/import-goods';
import { ReceiptRequestPayload } from '../../../../../../services/modules/receipt/receipt.request-payload';
import { ReceiptService } from '../../../../../../services/modules/receipt/receipt.service';
import { SyncErpService } from '../../../../../../services/modules/sync-erp/sync-erp.service';
import * as config from '../../import-goods.config';
import { currentUser } from '../../../../../../core/auth';
import { forkJoin } from 'rxjs';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';
import { UpdateCostService } from '../../../../../../services/modules/update-cost/update-cost.service';
import * as _moment from 'moment';
import { TreeNode } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-import-goods-elimination-invoice-add',
  templateUrl: './import-goods-elimination-invoice-add.component.html',
  styleUrls: ['./import-goods-elimination-invoice-add.component.scss']
})
export class ImportGoodsEliminationInvoiceAddComponent extends BaseFormComponent implements OnInit {
  @Input() dialogRef: DialogRef;
  @Output() success: EventEmitter<any> = new EventEmitter();

  private _itemList: any;
  get itemList(): any {
    return this._itemList;
  }
  @Input() set itemList(value: any) {
    this._itemList = value;
  }

  public mainConfig = mainConfig.MAIN_CONFIG;

  public elimStatus = 0;
  public elimType = config.ELIM_TYPE;
  public colsElimInvoice = config.COL_ELIM_VIEW_INVOICE_PI;
  public colsElimInventDetail = config.COL_ELIM_INVENT_DETAIL_PI;
  public eliminationValue: any = [{}];
  public listPurchaseInvoice: any = [];
  public receiptData: any = {};
  public purchaseInvoiceData: any = {};
  public currentUser: any = {};
  public currencyFreightAmount: string;
  public listOrg = [];
  public messageValidateDate: string;
  public rowGroupIgOrgCode: any;
  public scrollableCols: any[];
  public frozenCols: any[];

  public summaryAmount = 0;
  public summaryExchangeAmount = 0;
  public summaryElimRate = 0;
  public summaryFctAmount = 0;
  public summaryIgCost = 0;
  public summaryResalePrice = 0;

  public mustSave = false;

  constructor(
    private translate: TranslateService,
    public importGoodsService: ImportGoodsService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private syncErpService: SyncErpService,
    private igEliminationService: IgEliminationService,
    private igEliminationDetailService: IgEliminationDetailService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private receiptService: ReceiptService,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private configListService: ConfigListService,
    private updateCostService: UpdateCostService,
    private store: Store<AppState>
  ) {
    super();
    this.store.pipe(select(currentUser)).subscribe(res => {
      if (res) {
        this.currentUser = res;
      }
    });
  }

  ngOnInit() {
    this.scrollableCols = this.colsElimInventDetail.slice(4);
    this.frozenCols = this.colsElimInventDetail.slice(0, 4);

    if (this.dialogRef.input.piId) {
      this.elimStatus = 0;
      const initSub = forkJoin([
        this.purchaseInvoiceService.selectById(this.dialogRef.input.piId),
      ]).subscribe(res => {
        if (res) {
          this.purchaseInvoiceData = res[0];
          this.getEliminationInfoView(this.purchaseInvoiceData.id);
        }
      });
      this.subscriptions.push(initSub);
    }
  }

  public rounding(value: number): number {
    return (Math.round(value * 100) / 100);
  }

  public loadDataForGird(init?: boolean): void {
    this.itemList = this.getListNotTree();
    let total = 0;
    if (this._itemList && this._itemList.length > 0) {
      this.summaryAmount = 0;
      this.summaryExchangeAmount = 0;
      this.summaryElimRate = 0;
      this.summaryFctAmount = 0;
      this.summaryIgCost = 0;
      this.summaryResalePrice = 0;
      for (const item of this._itemList) {
        total += item.quantity * item.price;
      }
      for (const item of this._itemList) {
        item.amount = item.quantity * item.price; // tính số tiền
        if (init) {
          item.elimRate = item.elimRate ? item.elimRate : this.rounding((item.amount / total) * 100);
          item.fctAmount = item.fctAmount ? Math.ceil(item.fctAmount) : (item.corporateTaxExchange ? Math.ceil(item.corporateTaxExchange) : null);
          item.resalePrice = item.resalePrice ? item.resalePrice : null;
          if (this.eliminationValue && this.eliminationValue.length > 0) {
            if (this.receiptData && this.receiptData.exchangeRateValue) {
              if (this.purchaseInvoiceData.currency !== 'VND') {
                item.exchangeAmount = this.receiptData.exchangeRateValue * (item.quantity * item.price);
              } else {
                item.exchangeAmount = (item.quantity * item.price);
              }
            } else {
              item.exchangeAmount = (item.quantity * item.price);
            }
          }
        } else {
          this.mustSave = true;
        }
        item.igCost = item.exchangeAmount + (item.fctAmount ? item.fctAmount : 0);

        this.summaryAmount += item.amount;
        this.summaryExchangeAmount += item.exchangeAmount;
        this.summaryElimRate += item.elimRate;
        this.summaryFctAmount += item.fctAmount;
        this.summaryIgCost += item.igCost;
        this.summaryResalePrice += item.resalePrice;
      }
      this.summaryElimRate = this.rounding(this.summaryElimRate);
    }
    this.createItemDataTree();
    this.cdr.detectChanges();
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  createItemDataTree() {
    const itemSourceTemp = this.itemList;
    this.itemList = [];

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
      const childItems = itemSourceTemp.filter(x => x.isSubItem && x.id !== parent.id && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
      for (const child of childItems) {
        const childNode = {
          data: { ...child },
          leaf: true,
        };
        node.children.push(childNode);
        node.leaf = false;
      }
      this.itemList.push(node);
    }
    this.itemList = [...this.itemList];
  }

  public getListNotTree(): any {
    this.rowGroupIgOrgCode = {};
    const arrItemSave = [];
    this.itemList.sort(this.sortIgOrgCode);
    for (let i = 0; i < this.itemList.length; i++) {
      // group theo orgCode
      const rowData = this.itemList[i].data;
      const representativeName = rowData.igOrgCode;
      if (i === 0) {
        this.rowGroupIgOrgCode[representativeName] = { index: (i + 1).toString(), size: 1 };
      } else {
        const previousRowData = this.itemList[i - 1].data;
        const previousRowGroup = previousRowData.igOrgCode;
        if (representativeName === previousRowGroup) {
          this.rowGroupIgOrgCode[representativeName].size++;
        } else {
          this.rowGroupIgOrgCode[representativeName] = { index: (i + 1).toString(), size: 1 };
        }
      }
      // trải phẳng dữ liệu
      const item = this.itemList[i];
      item.data.indexNo = (i + 1).toString();
      arrItemSave.push(item.data);
      if (item.children && item.children.length > 0) {
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          children.data.indexNo = (i + 1).toString() + '.' + (j + 1).toString();
          arrItemSave.push(children.data);
        }
      }
    }
    return arrItemSave;
  }

  sortIgOrgCode(a, b) {
    const str1 = a.data.igOrgCode ? a.data.igOrgCode : '';
    const str2 = b.data.igOrgCode ? b.data.igOrgCode : '';
    if (str1 < str2) { return -1; }
    if (str1 > str2) { return 1; }
    return 0;
  }

  private checkOrgExistsInArray(arr: any, org: any): boolean {
    for (const obj of arr) {
      if (org && org === obj) {
        return true;
      }
    }
    return false;
  }

  public getEliminationInfoView(piId: string): void {
    const requestReceipt = new ReceiptRequestPayload();
    requestReceipt.piId = piId;

    const initSub = forkJoin([
      this.receiptService.selectFirstOrDefault(requestReceipt)
    ]).subscribe(res => {
      // lấy thông tin receipt
      if (res[0]) {
        this.receiptData = res[0];
      }

      let total = 0;
      for (let i = 0; i < this.itemList.length; i++) {
        const item = this.itemList[i];
        if (item.data.quantity && item.data.price) {
          total += item.data.quantity * item.data.price;
        }
        if (!this.checkOrgExistsInArray(this.listOrg, item.data.igOrgCode)) {
          this.listOrg.push(item.data.igOrgCode);
        }
        if (item.children && item.children.length > 0) {
          for (let j = 0; j < item.children.length; j++) {
            const children = item.children[j];
            if (children.data.quantity && children.data.price) {
              total += children.data.quantity * children.data.price;
            }
            if (!this.checkOrgExistsInArray(this.listOrg, children.data.igOrgCode)) {
              this.listOrg.push(children.data.igOrgCode);
            }
          }
        }
      }

      this.eliminationValue[0] = {
        itemAmount: total
      };

      this.loadDataForGird(true);

    });
    this.subscriptions.push(initSub);
  }

  public changeType(event: any, type: string) {
    if (type === 'invoice') {
      if (event.checked) {
        this.elimStatus = 1;
      } else {
        this.elimStatus = 0;
      }
    }
    if (type === 'manual') {
      if (event.checked) {
        this.elimStatus = 2;
      } else {
        this.elimStatus = 0;
      }
    }
    this.cdr.detectChanges();
  }

  public onBtnSaveClick(): void {
    if (!this.checkValidate()) {
      if (this.messageValidateDate) {
        this.notification.showWarning(this.messageValidateDate);
      } else {
        this.notification.showWarning(this.translate.instant('SYNC_ERP.PLEASE_ENTER'));
      }
      return;
    }

    if (this.elimStatus === 2) {
      if (this.summaryElimRate !== 100) {
        this.notification.showWarning(this.translate.instant('SYNC_ERP.TOTAL_RALE'));
        return;
      }
    }

    if (this.listOrg.length === 0) {
      this.notification.showWarning(this.translate.instant('Không có hàng hóa cần update cost'));
      return;
    }

    this.eliminationValue[0].type = this.elimStatus;

    // View invoice
    if (this.elimStatus === 1) {
      const saveConfirmation = new SaveConfirmation();
      saveConfirmation.accept = () => {

        const updateCost = {
          type: this.elimStatus,
          piId: this.purchaseInvoiceData.id,
          date: this.dialogRef.input.rowData.date
        };

        const listIgEliminationDto = [];
        for (const org of this.listOrg) {
          const igElimination = {
            type: this.elimStatus,
            piId: this.purchaseInvoiceData.id,
            itemAmount: this.eliminationValue[0].itemAmount,
            note: this.eliminationValue[0].note,
            orgCode: org
          };

          const igEliminationDto = {
            igElimination,
            listIgEliminationDetail: []
          };
          listIgEliminationDto.push(igEliminationDto);
        }

        const dataSave: any = {
          updateCost,
          listIgEliminationDto
        };
        this.updateCostService.merge(dataSave).subscribe(res => {
          if (res) {
            this.dialogRef.input.rowData = res;
            this.notification.showSuccess();
            this.success.emit();
            this.cdr.detectChanges();
            this.mustSave = false;
          }
        });

      };
      this.notification.confirm(saveConfirmation);
    }

    // Manual invent
    if (this.elimStatus === 2) {
      const saveConfirmation = new SaveConfirmation();
      saveConfirmation.accept = () => {

        const updateCost = {
          type: this.elimStatus,
          piId: this.purchaseInvoiceData.id,
          date: this.dialogRef.input.rowData.date
        };

        const listIgEliminationDto = [];
        for (const org of this.listOrg) {
          const igElimination = {
            type: this.elimStatus,
            piId: this.purchaseInvoiceData.id,
            orgCode: org
          };

          const listIgEliminationDetail = [];
          const itemListTemp = this.getListNotTree();
          const itemListInOrg = itemListTemp.filter(m => m.igOrgCode === org);
          for (const item of itemListInOrg) {
            const obj = {
              piItemId: item.id,
              indexNo: item.indexNo,
              isSubItem: item.isSubItem,
              poCode: item.poCode,
              quantity: item.quantity,
              price: item.price,
              exchangeAmount: Math.round(item.exchangeAmount),
              elimRate: item.elimRate,
              igCost: Math.round(item.igCost),
              poId: item.poId,
              poItemId: item.poItemId,
              itemCode: item.itemCode,
              itemName: item.itemName,
              fctAmount: Math.round(item.fctAmount),
              resalePrice: Math.round(item.resalePrice),
              note: item.note
            };
            listIgEliminationDetail.push(obj);
          }
          const igEliminationDto = {
            igElimination,
            listIgEliminationDetail
          };
          listIgEliminationDto.push(igEliminationDto);
        }

        const dataSave: any = {
          updateCost,
          listIgEliminationDto
        };
        this.updateCostService.merge(dataSave).subscribe(res => {
          if (res) {
            this.dialogRef.input.rowData = res;
            this.notification.showSuccess();
            this.success.emit();
            this.cdr.detectChanges();
            this.mustSave = false;
          }
        });

      };
      this.notification.confirm(saveConfirmation);
    }
  }

  public onBtnSyncErpAllocationClick(): void {

    if (!this.dialogRef.input.rowData.id) {
      this.notification.showWarning(this.translate.instant('SYNC_ERP.PLEASE_SAVE'));
      return;
    }

    if (!this.checkValidate()) {
      if (this.messageValidateDate) {
        this.notification.showWarning(this.messageValidateDate);
      } else {
        this.notification.showWarning(this.translate.instant('SYNC_ERP.PLEASE_ENTER'));
      }
      return;
    }

    if (this.mustSave) {
      this.notification.showWarning(this.translate.instant('SYNC_ERP.PLEASE_SAVE'));
      return;
    }

    if (this.elimStatus === 2) {
      if (this.summaryElimRate !== 100) {
        this.notification.showWarning(this.translate.instant('SYNC_ERP.TOTAL_RALE'));
        return;
      }
    }

    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      const request: any = {
        updateCostId: this.dialogRef.input.rowData.id,
        piId: this.purchaseInvoiceData.id,
        type: this.elimStatus
      };
      this.syncErpService.syncUpdateCost(request).subscribe(res => {
        if (res) {
          this.syncSuccess();
        }
      });
    };
    this.notification.confirm(saveConfirmation);
  }

  private syncSuccess() {
    this.purchaseInvoiceService.selectById(this.purchaseInvoiceData.id).subscribe(res => {
      if (res) {
        this.purchaseInvoiceData = res;
        this.notification.showSuccess();
        this.dialogRef.hide();
        this.success.emit();
        this.cdr.detectChanges();
      }
    });
  }

  public onChangeRate(rowData: any) {
    let totalRate = 0;
    if (rowData) {
      const itemListTemp = this.getListNotTree();
      for (const item of itemListTemp) {
        if (rowData.id !== item.id) {
          totalRate += item.elimRate;
        }
      }
      if (totalRate + rowData.elimRate > 100) {
        rowData.elimRate = 100 - totalRate;
        rowData.elimRate = this.rounding(rowData.elimRate);
      }
      this.loadDataForGird(true);
    }
  }

  public close() {
    this.dialogRef.hide();
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }

  public checkValidate(): boolean {
    this.messageValidateDate = null;
    let checkValidate = true;

    if (!this.dialogRef.input.rowData.date) {
      this.dialogRef.input.rowData.isDateValid = true;
      checkValidate = false;
    } else {
      const a = _moment(new Date(this.dialogRef.input.rowData.date), 'yyyy-MM-dd').toDate();
      const b = _moment(new Date(), 'yyyy-MM-dd').toDate();
      if (this.compareDate(a, b) === 1) {
        this.dialogRef.input.rowData.isDateValid = true;
        checkValidate = false;
        this.messageValidateDate = this.translate.instant('SYNC_ERP.PLEASE_ENTER_DATE_LESS_THAN_CURRENT_DATE');
      } else {
        this.dialogRef.input.rowData.isDateValid = false;
      }
    }

    if (!this.eliminationValue[0].note && this.elimStatus === 1) {
      checkValidate = false;
      this.dialogRef.input.rowData.isNoteValid = true;
    } else {
      this.dialogRef.input.rowData.isNoteValid = false;
    }

    return checkValidate;
  }

  public compareDate(date1: Date, date2: Date): number {
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date1.setMilliseconds(0);
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);
    date2.setMilliseconds(0);
    if (_moment(date1).isAfter(date2)) {
      return 1;
    }
    if (_moment(date1).isSame(date2)) {
      return 0;
    }
    if (_moment(date1).isBefore(date2)) {
      return -1;
    }
  }

}
