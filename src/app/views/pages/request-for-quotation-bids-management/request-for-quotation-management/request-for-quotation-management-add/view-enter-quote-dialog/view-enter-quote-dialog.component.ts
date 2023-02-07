import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { CurrencyRequestPayload } from '../../../../../../services/modules/category/currency/currency.request.payload';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { QuotationItemRequestPayload } from '../../../../../../services/modules/quotation-item/quotation-item.request-payload';
import { QuotationItemService } from '../../../../../../services/modules/quotation-item/quotation-item.service';
import { QuotationSupplierService } from '../../../../../../services/modules/quotation-supplier/quotation-supplier.service';
import {
  QuotationTradeConditionsRequestPayload
} from '../../../../../../services/modules/quotation-trade-conditions/quotation-trade-conditions.request-payload';
import {
  QuotationTradeConditionsService
} from '../../../../../../services/modules/quotation-trade-conditions/quotation-trade-conditions.service';
import { QuotationService } from '../../../../../../services/modules/quotation/quotation.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from '../view-enter-quote-dialog/view-enter-quote-dialog.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { DiscussWithFptComponent } from '../discuss-with-fpt/discuss-with-fpt.component';

@Component({
  selector: 'app-view-enter-quote-dialog',
  templateUrl: './view-enter-quote-dialog.component.html',
  styleUrls: ['./view-enter-quote-dialog.component.scss']
})
export class ViewEnterQuoteDialogComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: false }) form: NgForm;
  @ViewChild('discussWithFptComponent', { static: false }) discussWithFptComponent: DiscussWithFptComponent;
  public dialogRef: DialogRef = new DialogRef();

  public currencyRequestPayload = new CurrencyRequestPayload();

  public headerQuotationItemEnterQuote = config.QUOTATION_ITEM_ENTER_QUOTE;
  public headerCurrency = config.HEADER_CURRENCY;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public headerTradeConditions = config.TRADE_CONDITIONS;
  public goodsStatus = config.GOODS_STATUS;

  public hasEdit = false;
  public quotationData: any = {
    listQuotationSupplier: [],
    listQuotationItem: [],
    listQuotationTradeConditions: [],

    listQuotationSupplierDeleteId: [],
    listQuotationItemDeleteId: [],
    listQuotationTradeConditionsDeleteId: [],

  };
  public currentQuotationId: string;
  public totalBeforeDiscount = 0;
  public totalAmountAterDiscount = 0;
  public configListDataTax: any[];
  public addTradeConditions: any = {};
  public supplierData: any = {};
  public supplierId: string;
  public discount: any;

  constructor(
    public cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    public notification: NotificationService,
    public quotationService: QuotationService,
    public quotationItemService: QuotationItemService,
    public quotationSupplierService: QuotationSupplierService,
    public quotationTradeConditionsService: QuotationTradeConditionsService,
    public currencyService: CurrencyService,
    public supplierService: SupplierService
  ) {
    super();
  }

  ngOnInit() {
  }

  public close() {
    this.dialogRef.hide();
  }

  public onBtnShowDialogListClick(rowData?: any): void {
    this.initData(rowData);
    this.discussWithFptComponent.iniDataQuotationChat(rowData);
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public initData(rowData?: any): void {
    if (rowData) {
      this.supplierData = rowData;
      this.currentQuotationId = this.supplierData.requestForQuotationId;
      this.supplierId = this.supplierData.supplierId;
      this.discount = this.supplierData.discount ? this.supplierData.discount : null;
    }

    const requestQuotationItem = new QuotationItemRequestPayload();
    requestQuotationItem.requestForQuotationId = this.currentQuotationId;
    requestQuotationItem.supplierId = this.supplierId;

    const requestQuotationTradeConditions = new QuotationTradeConditionsRequestPayload();
    requestQuotationTradeConditions.requestForQuotationId = this.currentQuotationId;
    requestQuotationTradeConditions.supplierId = this.supplierId;

    const initSub = forkJoin([
      this.quotationService.selectById(this.currentQuotationId),
      this.quotationItemService.select(requestQuotationItem),
      this.quotationTradeConditionsService.select(requestQuotationTradeConditions),
    ]).subscribe(res => {
      if (res[0]) {
        this.quotationData = res[0];

        this.quotationData.quoteSupplierDto = { name: this.quotationData.quoteSupplier };
        this.quotationData.listQuotationItemDeleteId = [];
        this.quotationData.listQuotationTradeConditionsDeleteId = [];

        this.quotationData.listQuotationItem = res[1];
        this.quotationData.listQuotationTradeConditions = res[2];

        this.quotationData.quotePeopleEmailItems =
          this.quotationData.quotePeopleEmail ? this.quotationData.quotePeopleEmail.split(',') : [];

        // if (this.quotationData.listQuotationTradeConditions.length === 0) {
        //   this.quotationData.listQuotationTradeConditions = [
        //     {
        //       requestForQuotationId: this.currentQuotationId, supplierId: this.supplierId,
        //       name: 'Điều kiện thanh toán', description: 'Thanh toán trả sau '
        //     },
        //     {
        //       requestForQuotationId: this.currentQuotationId, supplierId: this.supplierId,
        //       name: 'Báo giá (bao gồm/hoặc chưa bao gồm)', description: 'Bao gồm thuế và chi phí khác'
        //     },
        //   ];
        // }

        this.getTotalDiscount();
      } else {
        // this.goBack();
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(initSub);
  }

  public onRowEditInit(): void {
    if (this.form) {
      this.form.form.markAsDirty();
    }
    this.getTotalDiscount();
  }

  public getTotalDiscount(): void {
    if (this.quotationData.listQuotationItem && this.quotationData.listQuotationItem.length > 0) {
      let totalBeforeDiscount = 0;
      for (const item of this.quotationData.listQuotationItem) {
        totalBeforeDiscount += +item.amountTotal ? +item.amountTotal : 0;
      }
      if (totalBeforeDiscount) {
        this.totalBeforeDiscount = +totalBeforeDiscount;
        this.totalAmountAterDiscount = (this.totalBeforeDiscount ? +this.totalBeforeDiscount : 0)
          - (this.discount ? +this.discount : 0);
      }
    }
  }

  public onChangeRowEditTaxRate(rowData?: any, event?: any): void {
    if (event) {
      rowData.taxType = +event.name;
      // Tiền thuế
      if (rowData.originalCurrency) {
        rowData.taxAmount = +((+rowData.originalCurrency * rowData.taxType) / 100);
      }
      // Tổng nguyên tệ
      rowData.originalCurrencyTotal =
        (rowData.taxAmount ? rowData.taxAmount : 0) + (rowData.originalCurrency ? rowData.originalCurrency : 0);
      // Tổng tiền (VND)
      rowData.amountTotal = rowData.originalCurrencyTotal;
      this.onRowEditInit();
    }

  }

  // Loại tiền
  public onChangeCurrency(rowData?: any, event?: any): void {
    if (event) {
      rowData.currency = event.code;
      this.onRowEditInit();
    }
  }

  // Nguyên tệ
  public onChangeOriginalCurrency(rowData?: any, event?: any): void {
    if (event) {
      rowData.originalCurrency = event < 0 ? 0 : event.target.value;
      const originalCurrency = +rowData.originalCurrency.replaceAll(',', '');
      // Check nếu có thuế
      if (rowData.taxType) {
        // Tiền thuế
        if (originalCurrency) {
          rowData.taxAmount = +((originalCurrency * rowData.taxType) / 100);
        }
        // Tổng nguyên tệ
        rowData.originalCurrencyTotal =
          (rowData.taxAmount ? +rowData.taxAmount : 0) + (rowData.originalCurrency ? +rowData.originalCurrency : 0);
        // Tổng tiền (VND)
        rowData.amountTotal = rowData.originalCurrencyTotal;
      }
      this.onRowEditInit();
    }
  }

  // Tổng nguyên tệ
  public onChangeOriginalCurrencyTotal(rowData?: any, event?: any): void {
    if (event) {
      rowData.originalCurrencyTotal = event < 0 ? 0 : event.target.value;
      this.onRowEditInit();
    }
  }

  // Đơn giá
  public onChangePrice(rowData?: any, event?: any): void {
    if (event) {
      rowData.price = event < 0 ? 0 : event.target.value;
      const price = +rowData.price.replaceAll(',', '');
      if (rowData.quantity && price) {
        rowData.originalCurrency = rowData.quantity * price;
        rowData.amount = rowData.quantity * price;
      } else {
        rowData.originalCurrency = price;
        rowData.amount = price;
      }

      // Check nếu có thuế
      if (rowData.taxType) {
        // Tiền thuế
        if (rowData.originalCurrency) {
          rowData.taxAmount = +((+rowData.originalCurrency * rowData.taxType) / 100);
        }
        // Tổng nguyên tệ
        rowData.originalCurrencyTotal =
          (rowData.taxAmount ? rowData.taxAmount : 0) + (rowData.originalCurrency ? rowData.originalCurrency : 0);
        // Tổng tiền (VND)
        rowData.amountTotal = rowData.originalCurrencyTotal;
      }

      this.onRowEditInit();
    }
  }

  // Tiền thuế
  public onChangeTaxAmount(rowData?: any, event?: any): void {
    if (event) {
      rowData.taxAmount = event < 0 ? 0 : event.target.value;
      const taxAmount = +rowData.taxAmount.replaceAll(',', '');

      if (taxAmount) {
        // Tổng nguyên tệ
        rowData.originalCurrencyTotal =
          (taxAmount ? taxAmount : 0) + (rowData.originalCurrency ? rowData.originalCurrency : 0);
        // Tổng tiền (VND)
        rowData.amountTotal = rowData.originalCurrencyTotal;
      }
      this.onRowEditInit();
    }
  }

  public onChangeDiscount(event?: any) {
    if (event) {
      this.onRowEditInit();
    }
  }

  public deleteRowTradeConditions(indexRow: any): void {
    const temp = this.quotationData.listQuotationTradeConditions.find((element, index) => index === indexRow);
    if (temp.id) {
      this.quotationData.listQuotationTradeConditionsDeleteId.push(temp.id);
    }
    this.quotationData.listQuotationTradeConditions =
      this.quotationData.listQuotationTradeConditions.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public addNewRowTradeConditions(): void {
    this.quotationData.listQuotationTradeConditions.push(this.addTradeConditions);
    this.addTradeConditions = {};
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public convertCurrencyMask(price: any): string {
    if (price !== null && price !== undefined) {
      const result = this.format(price, 0, 3, ',', '.');
      return result;
    } else {
      return '';
    }
  }

  private format(value: any, n: any, x: any, s: any, c: any) {
    let result = '';
    if (value != null && value !== undefined) {
      if (typeof (value) === 'string') {
        value = parseFloat(value);
      }
      const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
      const num = value.toFixed(Math.max(0, n));
      result = (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    }
    return result;
  }

}
