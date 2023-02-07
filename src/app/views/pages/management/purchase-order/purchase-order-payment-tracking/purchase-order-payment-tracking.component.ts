import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';
import { ToolbarModel } from '../../../../partials/content/toolbar/toolbar.model';
import * as config from './purchase-order-payment-tracking.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import { EpoPaymentService } from '../../../../../services/modules/epo-payment/epo-payment.service';
import {
  EpoInvoiceprepayAppliedTblService
} from '../../../../../services/modules/epo-invoiceprepay-applied-tbl/epo-invoiceprepay-applied-tbl.service';
import { PurchaseInvoiceService } from '../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { EpoPaymentUtilsService } from '../../../../../services/modules/epo-payment-utils/epo-payment-utils.service';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { Location } from '@angular/common';
@Component({
  selector: 'app-purchase-order-payment-tracking',
  templateUrl: './purchase-order-payment-tracking.component.html',
  styleUrls: ['./purchase-order-payment-tracking.component.scss']
})
export class PurchaseOrderPaymentTrackingComponent extends BaseFormComponent implements OnInit {
  @ViewChild('formEdit', { static: true }) formEdit: NgForm;

  selectedRowData: any;
  btnItems: MenuItem[] = [
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewClick(this.selectedRowData) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData) }
  ];

  public toolbarModel: ToolbarModel;
  public headers = config.HEADER;
  public headersView = config.HEADER_VIEW;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request: any = {};
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public dataSourceView = {
    items: null,
    paginatorTotal: undefined
  };
  public sum = {
    piTotalAmount: 0,
    paymentAmount: 0,
    amountRemain: 0,
    debtRemain: 0
  };
  public showDialogEdit = false;
  public showDialogView = false;

  public purchaseOrderData: any = {};
  public epoPaymentUtilsData: any = {};
  public currentFocusData: any = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public notificationService: NotificationService,
    public epoPaymentService: EpoPaymentService,
    public epoInvoiceprepayAppliedTblService: EpoInvoiceprepayAppliedTblService,
    public purchaseOrderService: PurchaseOrderService,
    public purchaseInvoiceService: PurchaseInvoiceService,
    private location: Location,
    public epoPaymentUtilsService: EpoPaymentUtilsService
  ) {
    super();
  }

  ngOnInit() {
    this.configToolbar();
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.request.poId = params.id;
        const requestEpoPaymentUtils: any = { objectId: params.id, type: 'PURCHASE_ORDER' };
        const initSub = forkJoin([
          this.purchaseOrderService.selectById(params.id),
          this.epoPaymentUtilsService.select(requestEpoPaymentUtils)
        ]).subscribe(res => {
          if (res[0] && res[0].id) {
            this.purchaseOrderData = res[0];
            this.purchaseOrderData.epoPaymentUtilsType = 'PURCHASE_ORDER';
            if (res[1] && res[1].length > 0) {
              this.purchaseOrderData.epoPaymentUtilsId = res[1][0].id;
              this.purchaseOrderData.epoPaymentUtilsAmount = res[1][0].amount;
              this.purchaseOrderData.epoPaymentUtilsNote = res[1][0].note;
            }
            this.initData();
          } else {
            this.goBack();
          }
          this.cdr.detectChanges();
        });
        this.subscriptions.push(initSub);
      } else {
        this.goBack();
      }
    });
    this.subscriptions.push(routeSub);
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.add.show = false;
    this.toolbarModel.search.show = false;
  }

  public initData(): void {
    this.request.pageIndex = 0;
    this.request.pageSize = 1000;
    const requests = [
      this.epoPaymentService.select(this.request),
      this.epoInvoiceprepayAppliedTblService.select(this.request),
      this.purchaseInvoiceService.select(this.request),
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.transformData(response[0], response[1], response[2]);
      });
    this.subscriptions.push(sub);
  }

  public rounding(value: number): number {
    return (Math.round(value * 100) / 100);
  }

  private async transformData(arrPayment: any[], arrPrepayApplied: any[], arrPi: any[]) {
    this.dataSource.items = [];
    let poTotalAmount = this.rounding(this.purchaseOrderData.totalAmountWithTax);
    // add PO
    const po = {
      ...this.purchaseOrderData,
      currency: this.purchaseOrderData.currency,
      date: this.purchaseOrderData.signDate,
      poTotalAmount: this.rounding(this.purchaseOrderData.totalAmountWithTax),
      description: this.purchaseOrderData.note,
      epoPaymentUtilsId: this.purchaseOrderData.epoPaymentUtilsId,
      epoPaymentUtilsAmount: this.purchaseOrderData.epoPaymentUtilsAmount,
      epoPaymentUtilsNote: this.purchaseOrderData.epoPaymentUtilsNote,
      epoPaymentUtilsType: this.purchaseOrderData.epoPaymentUtilsType
    };
    this.dataSource.items.push(po);
    // add PI
    let piTotalAmountAll = 0;
    for (const item of arrPi) {
      piTotalAmountAll = this.rounding(piTotalAmountAll + item.totalAmountWithTax);
      const pi = {
        ...item,
        currency: item.currency,
        date: item.syncSource === 'ORACLE_ERP' ? item.date : item.receiptDate,
        invoiceDate: item.date,
        piTotalAmount: this.rounding(item.totalAmountWithTax),
        amountRemain: this.rounding(poTotalAmount),
        debtRemain: this.rounding(piTotalAmountAll),
        description: item.invoiceDesc,
        invoiceId: item.erpInvoiceId,
        epoPaymentUtilsId: item.epoPaymentUtilsId,
        epoPaymentUtilsAmount: item.epoPaymentUtilsAmount,
        epoPaymentUtilsNote: item.epoPaymentUtilsNote,
        epoPaymentUtilsType: 'PURCHASE_INVOICE'
      };
      this.dataSource.items.push(pi);
    }
    // add Payment
    for (const item of arrPayment) {
      const pi = this.dataSource.items.find(m => m.invoiceId === item.invoiceId && m.epoPaymentUtilsType === 'PURCHASE_INVOICE');
      if (pi) {
        poTotalAmount = this.rounding(poTotalAmount - (item.paymentAmount ? item.paymentAmount : 0));
        piTotalAmountAll = this.rounding(piTotalAmountAll - (item.paymentAmount ? item.paymentAmount : 0));
        const p = {
          ...item,
          date: item.paymentDate,
          currency: item.currencyCode,
          amountRemain: poTotalAmount,
          debtRemain: piTotalAmountAll,
          epoPaymentUtilsType: 'EPO_PAYMENT'
        };
        const index = this.dataSource.items.indexOf(pi);
        this.dataSource.items.splice(index + 1, 0, p); // add đằng sau PI mà nó thanh toán
      }
    }
    // add PrepayApplied
    for (const item of arrPrepayApplied) {
      poTotalAmount = this.rounding(poTotalAmount - (item.prepayAmountApplied ? item.prepayAmountApplied : 0));
      piTotalAmountAll = this.rounding(piTotalAmountAll - (item.prepayAmountApplied ? item.prepayAmountApplied : 0));
      const pa = {
        ...item,
        currency: item.invoiceCurrencyCode,
        date: item.prepayGlDate,
        paymentAmount: item.prepayAmountApplied,
        amountRemain: poTotalAmount,
        debtRemain: piTotalAmountAll,
        paymentDate: item.prepayGlDate,
        description: item.description,
        prepayNumber: item.prepayNumber,
        epoPaymentUtilsId: item.epoPaymentUtilsId,
        epoPaymentUtilsAmount: item.epoPaymentUtilsAmount,
        epoPaymentUtilsNote: item.epoPaymentUtilsNote,
        epoPaymentUtilsType: 'EPO_INVOICEPREPAY_APPLIED_TBL'
      };
      this.dataSource.items.push(pa);
    }
    // sum
    for (const item of this.dataSource.items) {
      this.sum.piTotalAmount += (item.piTotalAmount && item.epoPaymentUtilsType === 'PURCHASE_INVOICE') ? item.piTotalAmount : 0;
      this.sum.paymentAmount += item.paymentAmount ? item.paymentAmount : 0;
    }
    this.sum.amountRemain = poTotalAmount;
    this.sum.debtRemain = piTotalAmountAll;
    this.cdr.detectChanges();
  }

  public goView(): void {
    this.router.navigate([`list/view/${this.purchaseOrderData.id}`], { relativeTo: this.route.parent });
  }

  public goBack(): void {
    this.location.back();
    // this.router.navigate([`list`], { relativeTo: this.route.parent });
  }

  public onBtnEditClick(rowData: any): void {
    this.currentFocusData = rowData;
    if (rowData.epoPaymentUtilsId) {
      this.epoPaymentUtilsService.selectById(rowData.epoPaymentUtilsId).subscribe(m => {
        this.epoPaymentUtilsData = m;
        this.showDialogEdit = true;
        this.cdr.detectChanges();
      });
    } else {
      this.epoPaymentUtilsData = {};
      this.epoPaymentUtilsData.objectId = rowData.id;
      this.epoPaymentUtilsData.type = rowData.epoPaymentUtilsType;
      this.showDialogEdit = true;
      this.cdr.detectChanges();
    }
  }

  public onSaveDialogEditClick() {
    if (this.formEdit) {
      if (!this.validateForm(this.formEdit, 'form-edit')) {
        this.notificationService.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (this.formEdit.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          const saveSub = this.epoPaymentUtilsService.merge(this.epoPaymentUtilsData).subscribe(res => {
            this.currentFocusData.epoPaymentUtilsId = res.id;
            this.currentFocusData.epoPaymentUtilsAmount = res.amount;
            this.currentFocusData.epoPaymentUtilsNote = res.note;
            this.notificationService.showSuccess();
            this.showDialogEdit = false;
            this.formEdit.form.markAsPristine();
            this.cdr.detectChanges();
          });
          this.subscriptions.push(saveSub);
        };
        this.notificationService.confirm(saveConfirmation);
      } else {
        this.onCancelDialogEditClick();
      }
    }
  }

  public onCancelDialogEditClick() {
    this.epoPaymentUtilsData = {};
    this.currentFocusData = {};
    this.showDialogEdit = false;
  }

  public onBtnViewClick(rowData: any): void {
    this.dataSourceView.items = [];
    const arrFilter = ['PURCHASE_INVOICE', 'EPO_PAYMENT', 'EPO_INVOICEPREPAY_APPLIED_TBL'];
    let arr = [];
    if (rowData.invoiceId) {
      arr = this.dataSource.items.filter(m => arrFilter.includes(m.epoPaymentUtilsType) && m.invoiceId === rowData.invoiceId);
    } else {
      arr.push(rowData);
    }
    const pi = arr.find(m => m.epoPaymentUtilsType === 'PURCHASE_INVOICE');
    let amountRemain = 0;
    for (const item of arr) {
      const element: any = {
        epoPaymentUtilsType: item.epoPaymentUtilsType,
        checkId: item.checkId,
        prepayNumber: item.prepayNumber,
        invoiceId: item.invoiceId,
        invoiceDate: pi ? pi.invoiceDate : null,
        piTotalAmount: pi ? pi.piTotalAmount : null,
        invoiceDesc: pi ? pi.invoiceDesc : null,
        invoiceConversionRate: pi ? pi.conversionRate : null,
        invoiceCurrency: pi ? pi.currency : null
      }
      if (element.epoPaymentUtilsType === 'PURCHASE_INVOICE') {
        element.amountRemain = item.piTotalAmount;
        amountRemain = item.piTotalAmount;
      }
      if (element.epoPaymentUtilsType === 'EPO_PAYMENT') {
        element.date = item.date;
        element.paymentAmount = item.paymentAmount;
        element.description = item.description;
        element.bankAccountName = item.bankAccountName;
        element.currency = item.currencyCode;
        element.exchangeRate = item.exchangeRate;
        amountRemain = this.rounding(amountRemain - element.paymentAmount);
        element.amountRemain = amountRemain;
      }
      if (element.epoPaymentUtilsType === 'EPO_INVOICEPREPAY_APPLIED_TBL') {
        element.date = item.date;
        element.invoiceDate = item.prepayInvoiceDate;
        element.paymentAmount = item.prepayAmountApplied;
        element.description = item.description;
        element.currency = item.invoiceCurrencyCode;
        element.exchangeRate = item.exchangeRate;
        amountRemain = this.rounding(amountRemain - element.paymentAmount);
        element.amountRemain = amountRemain;
      }
      this.dataSourceView.items.push(element);
    }
    this.showDialogView = true;
    this.cdr.detectChanges();
  }

  public onCancelDialogViewClick() {
    this.showDialogView = false;
  }

  public onShowContextMenu() {
    this.btnItems[0].visible = this.selectedRowData.epoPaymentUtilsType !== 'PURCHASE_ORDER';
  }

}
