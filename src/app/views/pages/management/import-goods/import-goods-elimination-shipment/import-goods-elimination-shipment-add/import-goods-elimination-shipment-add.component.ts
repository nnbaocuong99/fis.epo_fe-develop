import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { SaveConfirmation } from '../../../../../../services/common/confirmation/save-confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { IgEliminationDetailService } from '../../../../../../services/modules/ig-elimination-detail/ig-elimination-detail.service';
import { IgEliminationRequestPayload } from '../../../../../../services/modules/ig-elimination/ig-elimination-request-payload';
import { IgEliminationService } from '../../../../../../services/modules/ig-elimination/ig-elimination.service';
import { ImportGoodsService } from '../../../../../../services/modules/import-goods';
import { ReceiptRequestPayload } from '../../../../../../services/modules/receipt/receipt.request-payload';
import { ReceiptService } from '../../../../../../services/modules/receipt/receipt.service';
import { ShipmentService } from '../../../../../../services/modules/shipment/shipment.service';
import { SyncErpService } from '../../../../../../services/modules/sync-erp/sync-erp.service';
import * as config from '../../import-goods.config';
import { currentUser } from '../../../../../../core/auth';
import { forkJoin } from 'rxjs';
import { PurchaseInvoiceRequestPayload } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';
import { ConfigListRequestPayload } from '../../../../../../services/modules/config-list/config-list.request.payload';
import { UpdateCostService } from '../../../../../../services/modules/update-cost/update-cost.service';
import * as _moment from 'moment';
import { TreeNode } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-import-goods-elimination-shipment-add',
  templateUrl: './import-goods-elimination-shipment-add.component.html',
  styleUrls: ['./import-goods-elimination-shipment-add.component.scss']
})
export class ImportGoodsEliminationShipmentAddComponent extends BaseFormComponent implements OnInit {
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
  public colsElimInvoice = config.COL_ELIM_VIEW_INVOICE_S;
  public colsElimInventDetail = config.COL_ELIM_INVENT_DETAIL_S;
  public colsElimInventInfo = config.COL_ELIM_INVENT_INFO;
  public eliminationValue: any = [{}];
  public listPurchaseInvoice: any = [];
  public receiptData: any = {};
  public shipmentData: any = {};
  public currentUser: any = {};
  public requestIgElimination = new IgEliminationRequestPayload();
  public currencyFreightAmount: string;
  public listCostType = [];
  public listOrg = [];
  public messageValidateDate: string;
  public importVatAmount: number;
  public rowGroupIgOrgCode: any;
  public scrollableCols: any[];
  public frozenCols: any[];

  public summaryAmount = 0;
  public summaryExchangeAmount = 0;
  public summaryImportTax = 0;
  public summaryImportVat = 0;
  public summaryElimRate = 0;
  public summaryFreightAmount = 0;
  public summaryInsuranceAmount = 0;
  public summaryFctAmount = 0;
  public summaryCostUpdated = 0;
  public summaryIgCost = 0;
  public summaryResalePrice = 0;

  public mustSave = false;

  constructor(
    private translate: TranslateService,
    public importGoodsService: ImportGoodsService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private shipmentService: ShipmentService,
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
    this.scrollableCols = this.colsElimInventDetail.slice(3);
    this.frozenCols = this.colsElimInventDetail.slice(0, 3);

    if (this.dialogRef.input.shipmentId) {
      this.elimStatus = 0;
      const requestConfigList = new ConfigListRequestPayload();
      requestConfigList.type = 'COST_TYPE';
      const initSub = forkJoin([
        this.shipmentService.selectById(this.dialogRef.input.shipmentId),
        this.configListService.select(requestConfigList),
      ]).subscribe(res => {
        if (res) {
          this.shipmentData = res[0];
          this.listCostType = res[1];
          this.getEliminationInfoView(this.shipmentData.id);
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
    if (this.itemList && this.itemList.length > 0) {
      this.summaryAmount = 0;
      this.summaryExchangeAmount = 0;
      this.summaryImportTax = 0;
      this.summaryImportVat = 0;
      this.summaryElimRate = 0;
      this.summaryFreightAmount = 0;
      this.summaryInsuranceAmount = 0;
      this.summaryFctAmount = 0;
      this.summaryCostUpdated = 0;
      this.summaryIgCost = 0;
      this.summaryResalePrice = 0;

      for (const item of this.itemList) {
        total += item.quantity * item.price;
      }
      for (const item of this.itemList) {
        item.amount = item.quantity * item.price; // tính số tiền
        if (init) {
          item.elimRate = item.elimRate ? item.elimRate : this.rounding((item.amount / total) * 100);
          item.fctAmount = item.fctAmount ? Math.round(item.fctAmount) : (item.corporateTaxExchange ? Math.round(item.corporateTaxExchange) : null);
          if (this.eliminationValue && this.eliminationValue.length > 0) {
            if (this.receiptData && this.receiptData.exchangeRateValue) {
              if (this.shipmentData.currency !== 'VND') {
                // tslint:disable-next-line:max-line-length
                item.exchangeAmount = this.receiptData.exchangeRateValue * (item.quantity * item.price);
              } else {
                item.exchangeAmount = item.quantity * item.price;
              }
            } else {
              item.exchangeAmount = item.quantity * item.price;
            }
            if (this.eliminationValue[0].allocationRedemptionFee) {
              item.freightAmount = this.eliminationValue[0].allocationRedemptionFee * (item.elimRate / 100);
            } else {
              item.freightAmount = 0;
            }
            if (this.eliminationValue[0].allocationInsurrance) {
              item.insuranceAmount = this.eliminationValue[0].allocationInsurrance * (item.elimRate / 100);
            } else {
              item.insuranceAmount = 0;
            }
          }
        } else {
          this.mustSave = true;
        }

        item.costUpdated = item.exchangeAmount + item.freightAmount + item.insuranceAmount;
        item.igCost = item.costUpdated + (item.importTax ? item.importTax : 0) + (item.importVat ? item.importVat : 0) + (item.fctAmount ? item.fctAmount : 0);

        this.summaryAmount += item.amount ? item.amount : 0;
        this.summaryExchangeAmount += item.exchangeAmount ? item.exchangeAmount : 0;
        this.summaryImportTax += item.importTax ? item.importTax : 0;
        this.summaryImportVat += item.importVat ? item.importVat : 0;
        this.summaryElimRate += item.elimRate ? item.elimRate : 0;
        this.summaryFreightAmount += item.freightAmount ? item.freightAmount : 0;
        this.summaryInsuranceAmount += item.insuranceAmount ? item.insuranceAmount : 0;
        this.summaryFctAmount += item.fctAmount ? item.fctAmount : 0;
        this.summaryCostUpdated += item.costUpdated ? item.costUpdated : 0;
        this.summaryIgCost += item.igCost ? item.igCost : 0;
        this.summaryResalePrice += item.resalePrice ? item.resalePrice : 0;
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
      const childItems = itemSourceTemp.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
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

  private getCostTypeName(source: any[], code: string): string {
    const item = source.filter(x => x.code === code)[0];
    return item ? item.name : null;
  }

  private checkOrgExistsInArray(arr: any, org: any): boolean {
    for (const obj of arr) {
      if (org && org === obj) {
        return true;
      }
    }
    return false;
  }

  public getEliminationInfoView(shipmentId: string): void {
    const requestReceipt = new ReceiptRequestPayload();
    requestReceipt.shipmentId = shipmentId;

    const requestPurchaseInvoice = new PurchaseInvoiceRequestPayload();
    requestPurchaseInvoice.pageIndex = 0;
    requestPurchaseInvoice.pageSize = 1000;
    requestPurchaseInvoice.waybillNumber = this.shipmentData.waybillNumber;
    requestPurchaseInvoice.notYetAddUpdateCost = true;

    const initSub = forkJoin([
      this.receiptService.selectFirstOrDefault(requestReceipt),
      this.purchaseInvoiceService.select(requestPurchaseInvoice),
    ]).subscribe(res => {
      // lấy thông tin receipt
      if (res[0]) {
        this.receiptData = res[0];
      }
      // transform dữ liệu
      let freightAmount = 0;
      let insuranceAmount = 0;
      let importTaxAmount = 0;
      this.importVatAmount = 0;

      if (res[1] && res[1].length > 0) {
        const arrCostTypeForUpdateCost = this.listCostType.filter(m => ['2', '3', '8', '9'].includes(m.code)).map(m => m.name);
        this.listPurchaseInvoice = res[1].filter(m => arrCostTypeForUpdateCost.includes(m.costType));

        for (const item of this.listPurchaseInvoice) {
          // Vận tải
          if (item.costType === this.getCostTypeName(this.listCostType, '3')) {
            freightAmount += item.totalAmount;
            this.currencyFreightAmount = this.currencyFreightAmount ? this.currencyFreightAmount : item.currency;
          }
          // Bảo hiểm
          if (item.costType === this.getCostTypeName(this.listCostType, '2')) {
            insuranceAmount += item.totalAmount;
          }
          // Thuế NK
          if (item.costType === this.getCostTypeName(this.listCostType, '8')) {
            importTaxAmount += item.totalAmount;
          }
          // Thuế VAT NK
          if (item.costType === this.getCostTypeName(this.listCostType, '9')) {
            this.importVatAmount += item.totalAmount;
          }
        }
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
        freightCurrency: this.currencyFreightAmount,
        importTax: importTaxAmount,
        taxVat: this.importVatAmount,
        freightAmount: freightAmount ? freightAmount : 0,
        insuranceAmount: insuranceAmount ? insuranceAmount : 0,
        allocationInsurrance: insuranceAmount ? insuranceAmount : 0
      };
      this.eliminationValue.map(x => {
        x.itemAmount = total;
        if (this.currencyFreightAmount !== 'VND') {
          // x.freightExRate = this.shipmentData.currency !== 'VND' ? (this.receiptData ? this.receiptData.exchangeRateValue : 0) : null;
          x.freightExRate = null;
        } else {
          x.freightExRate = null;
        }
        if (this.currencyFreightAmount !== 'VND') {
          // x.allocationRateOfCharge = this.shipmentData.currency !== 'VND' ? (this.receiptData ? this.receiptData.exchangeRateValue : 0) : null;
          x.allocationRateOfCharge = null;
        } else {
          x.allocationRateOfCharge = null;
        }
        x.freightExchangeValue = x.freightExRate ? (x.freightAmount * x.freightExRate) : x.freightAmount;
        x.allocationOriginalCurrency = x.allocationOriginalCurrency ? x.allocationOriginalCurrency : freightAmount;
        // tslint:disable-next-line:max-line-length
        x.allocationRedemptionFee = x.allocationRateOfCharge ? (x.allocationOriginalCurrency * x.allocationRateOfCharge) : x.allocationOriginalCurrency;

        x.freightExRateData = {
          conversionRate: x.freightExRate,
          date: x.freightExRateDate,
          type: x.freightExRateType,
          currencyFrom: this.currencyFreightAmount
        };
        x.allocationRateOfChargeData = {
          conversionRate: x.allocationRateOfCharge,
          date: x.allocationRateOfChargeDate,
          type: x.allocationRateOfChargeType,
          currencyFrom: this.currencyFreightAmount
        };
        return x;
      });
      this.loadDataForGird(true);
    });
    this.subscriptions.push(initSub);
  }

  public changeType(event: any, type: string) {
    if (type === 'invoice') {
      if (event.checked) {
        this.elimStatus = 1;
        this.eliminationValue[0].taxVat = 0;
      } else {
        this.elimStatus = 0;
      }
    }
    if (type === 'manual') {
      if (event.checked) {
        this.elimStatus = 2;
        this.eliminationValue[0].taxVat = this.importVatAmount;
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

    const arrPiId = this.listPurchaseInvoice.map(m => m.id);
    const strPiId = arrPiId.join(',');

    // View invoice
    if (this.elimStatus === 1) {
      const saveConfirmation = new SaveConfirmation();
      saveConfirmation.accept = () => {

        const updateCost = {
          type: this.elimStatus,
          shipmentId: this.shipmentData.id,
          date: this.dialogRef.input.rowData.date,
          listPiId: strPiId
        };

        const listIgEliminationDto = [];
        for (const org of this.listOrg) {
          const igElimination = {
            type: this.elimStatus,
            shipmentId: this.shipmentData.id,
            itemAmount: this.eliminationValue[0].itemAmount,
            importTax: this.eliminationValue[0].importTax,
            taxVat: this.eliminationValue[0].taxVat,
            freightAmount: this.eliminationValue[0].freightAmount,
            freightExRate: this.eliminationValue[0].freightExRate,
            freightExRateDate: this.eliminationValue[0].freightExRateDate,
            freightExRateType: this.eliminationValue[0].freightExRateType,
            freightExchangeValue: this.eliminationValue[0].freightExchangeValue,
            insuranceAmount: this.eliminationValue[0].insuranceAmount,
            freightCurrency: this.eliminationValue[0].freightCurrency,
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
          shipmentId: this.shipmentData.id,
          date: this.dialogRef.input.rowData.date,
          listPiId: strPiId
        };

        const listIgEliminationDto = [];
        for (const org of this.listOrg) {
          const igElimination = {
            type: this.elimStatus,
            shipmentId: this.shipmentData.id,
            importTax: Math.round(this.eliminationValue[0].importTax),
            taxVat: Math.round(this.eliminationValue[0].taxVat),
            allocationOriginalCurrency: Math.round(this.eliminationValue[0].allocationOriginalCurrency),
            allocationRedemptionFee: Math.round(this.eliminationValue[0].allocationRedemptionFee),
            allocationInsurrance: Math.round(this.eliminationValue[0].allocationInsurrance),
            allocationRateOfCharge: this.eliminationValue[0].allocationRateOfCharge,
            allocationRateOfChargeDate: this.eliminationValue[0].allocationRateOfChargeDate,
            allocationRateOfChargeType: this.eliminationValue[0].allocationRateOfChargeType,
            freightCurrency: this.eliminationValue[0].freightCurrency,
            note: this.eliminationValue[0].note,
            orgCode: org
          };

          const listIgEliminationDetail = [];
          const itemListTemp = this.getListNotTree();
          const itemListInOrg = itemListTemp.filter(m => m.igOrgCode === org);
          for (const item of itemListInOrg) {
            const obj = {
              shipmentItemId: item.id,
              indexNo: item.indexNo,
              isSubItem: item.isSubItem,
              poCode: item.poCode,
              quantity: item.quantity,
              price: item.price,
              exchangeAmount: Math.round(item.exchangeAmount),
              importTax: Math.round(item.importTax),
              importVat: Math.round(item.importVat),
              elimRate: item.elimRate,
              freightAmount: Math.round(item.freightAmount),
              insuranceAmount: Math.round(item.insuranceAmount),
              costUpdated: Math.round(item.costUpdated),
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

      // if (Math.round(this.summaryFreightAmount) != Math.round(this.eliminationValue[0].allocationRedemptionFee)) {
      //   this.notification.showWarning(this.translate.instant('SYNC_ERP.SUMMARY_FREIGHT_AMOUNT'));
      //   return;
      // }

      // if (Math.round(this.summaryInsuranceAmount) != Math.round(this.eliminationValue[0].allocationInsurrance)) {
      //   this.notification.showWarning(this.translate.instant('SYNC_ERP.SUMMARY_INSURANCE_AMOUNT'));
      //   return;
      // }

      // if (Math.round(this.summaryImportTax) != Math.round(this.eliminationValue[0].importTax)) {
      //   this.notification.showWarning(this.translate.instant('SYNC_ERP.SUMMARY_IMPORT_TAX'));
      //   return;
      // }
    }

    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      const request: any = {
        updateCostId: this.dialogRef.input.rowData.id,
        shipmentId: this.shipmentData.id,
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
    this.shipmentService.selectById(this.shipmentData.id).subscribe(shipment => {
      if (shipment) {
        this.shipmentData = shipment;
        this.notification.showSuccess();
        this.dialogRef.hide();
        this.success.emit();
        this.cdr.detectChanges();
      }
    });
  }

  public onChangeExchangeRate1(exchangeRateDto: any, rowData: any): void {
    if (exchangeRateDto) {
      rowData.freightExRate = exchangeRateDto.conversionRate;
      rowData.freightExRateDate = exchangeRateDto.date;
      rowData.freightExRateType = exchangeRateDto.type;
      if (rowData.freightAmount && rowData.freightExRate) {
        rowData.freightExchangeValue = rowData.freightAmount * rowData.freightExRate;
      } else {
        rowData.freightExchangeValue = null;
      }
    }
    this.checkValidate();
  }

  public onChangeAllocationFreightAmount(value: any, rowData: any): void {
    if (rowData.freightAmount && rowData.freightExRate) {
      rowData.freightExchangeValue = rowData.freightAmount * rowData.freightExRate;
    } else {
      rowData.freightExchangeValue = rowData.freightAmount;
    }
  }

  public onChangeExchangeRate(exchangeRateDto: any, rowData: any): void {
    if (exchangeRateDto) {
      rowData.allocationRateOfCharge = exchangeRateDto.conversionRate;
      rowData.allocationRateOfChargeDate = exchangeRateDto.date;
      rowData.allocationRateOfChargeType = exchangeRateDto.type;
      if (rowData.allocationOriginalCurrency && rowData.allocationRateOfCharge) {
        rowData.allocationRedemptionFee = rowData.allocationOriginalCurrency * rowData.allocationRateOfCharge;
      } else {
        rowData.allocationRedemptionFee = null;
      }
      this.loadDataForGird(true);
    }
    this.checkValidate();
  }

  public onChangeAllocationOriginalCurrency(value: any, rowData: any): void {
    if (rowData.allocationOriginalCurrency && rowData.allocationRateOfCharge) {
      rowData.allocationRedemptionFee = rowData.allocationOriginalCurrency * rowData.allocationRateOfCharge;
    } else {
      rowData.allocationRedemptionFee = rowData.allocationOriginalCurrency;
    }
    this.loadDataForGird(true);
  }

  public onChangeAllocationInsurrance(value: any, rowData: any): void {
    this.loadDataForGird();
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

    if (this.elimStatus === 1) {
      if (this.eliminationValue[0].freightAmount && this.eliminationValue[0].freightAmount > 0 && this.currencyFreightAmount && this.currencyFreightAmount !== 'VND') {
        if (!this.eliminationValue[0].freightExRate || this.eliminationValue[0].freightExRate <= 0) {
          checkValidate = false;
          this.dialogRef.input.rowData.isFreightExRateValid = true;
        } else {
          this.dialogRef.input.rowData.isFreightExRateValid = false;
        }
      }
    }

    if (this.elimStatus === 2) {
      if (this.eliminationValue[0].allocationOriginalCurrency && this.eliminationValue[0].allocationOriginalCurrency > 0 && this.currencyFreightAmount && this.currencyFreightAmount !== 'VND') {
        if (!this.eliminationValue[0].allocationRateOfCharge || this.eliminationValue[0].allocationRateOfCharge <= 0) {
          checkValidate = false;
          this.dialogRef.input.rowData.isAllocationRateOfChargeValid = true;
        } else {
          this.dialogRef.input.rowData.isAllocationRateOfChargeValid = false;
        }
      }
    }

    if (!this.eliminationValue[0].note) {
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
