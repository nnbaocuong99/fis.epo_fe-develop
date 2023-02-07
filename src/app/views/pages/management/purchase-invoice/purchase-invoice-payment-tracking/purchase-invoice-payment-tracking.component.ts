import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { PurchaseInvoiceService } from '../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { ToolbarModel } from '../../../../partials/content/toolbar/toolbar.model';
import * as config from './purchase-invoice-payment-tracking.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import { EpoPaymentService } from '../../../../../services/modules/epo-payment/epo-payment.service';
import {
  EpoInvoiceprepayAppliedTblService
} from '../../../../../services/modules/epo-invoiceprepay-applied-tbl/epo-invoiceprepay-applied-tbl.service';
import { EpoPaymentUtilsService } from '../../../../../services/modules/epo-payment-utils/epo-payment-utils.service';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { PurchaseInvoiceItemService } from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-purchase-invoice-payment-tracking',
  templateUrl: './purchase-invoice-payment-tracking.component.html',
  styleUrls: ['./purchase-invoice-payment-tracking.component.scss']
})
export class PurchaseInvoicePaymentTrackingComponent extends BaseFormComponent implements OnInit {
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

  public purchaseInvoiceData: any = {};
  public epoPaymentUtilsData: any = {};
  public currentFocusData: any = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public notificationService: NotificationService,
    public epoPaymentService: EpoPaymentService,
    private location: Location,
    public epoInvoiceprepayAppliedTblService: EpoInvoiceprepayAppliedTblService,
    public purchaseInvoiceService: PurchaseInvoiceService,
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    public epoPaymentUtilsService: EpoPaymentUtilsService
  ) {
    super();
  }

  ngOnInit() {
    this.configToolbar();
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.request.piId = params.id;
        const requestEpoPaymentUtils: any = { objectId: params.id, type: 'PURCHASE_INVOICE' };
        const initSub = forkJoin([
          this.purchaseInvoiceService.selectById(params.id),
          this.epoPaymentUtilsService.select(requestEpoPaymentUtils)
        ]).subscribe(res => {
          if (res[0] && res[0].id) {
            this.purchaseInvoiceData = res[0];
            this.purchaseInvoiceData.epoPaymentUtilsType = 'PURCHASE_INVOICE';
            if (res[1] && res[1].length > 0) {
              this.purchaseInvoiceData.epoPaymentUtilsId = res[1][0].id;
              this.purchaseInvoiceData.epoPaymentUtilsAmount = res[1][0].amount;
              this.purchaseInvoiceData.epoPaymentUtilsNote = res[1][0].note;
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
      this.epoInvoiceprepayAppliedTblService.select(this.request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.transformData(response[0], response[1]);
      });
    this.subscriptions.push(sub);
  }

  public rounding(value: number): number {
    return (Math.round(value * 100) / 100);
  }

  private transformData(arrPayment: any[], arrPrepayApplied: any[]) {
    this.dataSource.items = [];
    let piTotalAmount = this.rounding(this.purchaseInvoiceData.totalAmountWithTax);
    // add PI
    const pi = {
      ...this.purchaseInvoiceData,
      currency: this.purchaseInvoiceData.currency,
      date: this.purchaseInvoiceData.syncSource === 'ORACLE_ERP' ? this.purchaseInvoiceData.date : this.purchaseInvoiceData.receiptDate,
      invoiceDate: this.purchaseInvoiceData.date,
      piTotalAmount: this.rounding(this.purchaseInvoiceData.totalAmountWithTax),
      amountRemain: this.rounding(this.purchaseInvoiceData.totalAmountWithTax),
      debtRemain: this.rounding(this.purchaseInvoiceData.totalAmountWithTax),
      description: this.purchaseInvoiceData.invoiceDesc,
      invoiceId: this.purchaseInvoiceData.erpInvoiceId,
      epoPaymentUtilsId: this.purchaseInvoiceData.epoPaymentUtilsId,
      epoPaymentUtilsAmount: this.purchaseInvoiceData.epoPaymentUtilsAmount,
      epoPaymentUtilsNote: this.purchaseInvoiceData.epoPaymentUtilsNote,
      epoPaymentUtilsType: this.purchaseInvoiceData.epoPaymentUtilsType
    };
    this.dataSource.items.push(pi);
    // add Payment
    for (const item of arrPayment) {
      piTotalAmount = this.rounding(piTotalAmount - (item.paymentAmount ? item.paymentAmount : 0));
      const p = {
        ...item,
        currency: item.currencyCode,
        date: item.paymentDate,
        amountRemain: piTotalAmount,
        debtRemain: piTotalAmount,
        epoPaymentUtilsType: 'EPO_PAYMENT'
      };
      this.dataSource.items.push(p);
    }
    // add PrepayApplied
    for (const item of arrPrepayApplied) {
      piTotalAmount = this.rounding(piTotalAmount - (item.prepayAmountApplied ? item.prepayAmountApplied : 0));
      const pa = {
        ...item,
        currency: item.invoiceCurrencyCode,
        date: item.prepayGlDate,
        paymentAmount: item.prepayAmountApplied,
        amountRemain: piTotalAmount,
        debtRemain: piTotalAmount,
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
    this.sum.amountRemain = piTotalAmount;
    this.sum.debtRemain = piTotalAmount;
    this.cdr.detectChanges();
  }

  public goView(): void {
    this.router.navigate([`list/view/${this.purchaseInvoiceData.id}`], { relativeTo: this.route.parent });
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
    const arr = this.dataSource.items.filter(m => arrFilter.includes(m.epoPaymentUtilsType) && m.invoiceId === rowData.invoiceId);
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
