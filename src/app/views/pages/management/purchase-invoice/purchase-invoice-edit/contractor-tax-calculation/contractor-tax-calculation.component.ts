import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { PurchaseInvoiceItemService } from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import * as config from './contractor-tax-calculation.config';
import { MatPaginator } from '@angular/material';
import { TaxCodeService } from '../../../../../../services/modules/category/tax-code/tax-code.service';
import { TaxCodeRequestPayload } from '../../../../../../services/modules/category/tax-code/tax-code.request.payload';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { ExchangeRateTypeService } from '../../../../../../services/modules/category/exchange-rate-type/exchange-rate-type.service';
import { DatePipe } from '@angular/common';
import { ExchangeRateRequestPayload } from '../../../../../../services/modules/category/exchange-rate/exchange-rate.request.payload';
import { ExchangeRateService } from '../../../../../../services/modules/category/exchange-rate/exchange-rate.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CustomConfirmation } from '../../../../../../services/common/confirmation';
import { PurchaseInvoiceRequestSaveTaxDto } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { NotificationListService } from '../../../../../../services/modules/notification-list/notification-list.service';
import {
  PurchaseInvoiceItemRequestPayload
} from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.request-payload';
@Component({
  selector: 'app-contractor-tax-calculation',
  templateUrl: './contractor-tax-calculation.component.html',
  styleUrls: ['./contractor-tax-calculation.component.scss'],
  providers: [DatePipe]
})
export class ContractorTaxCalculationComponent extends BaseFormComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() purchaseInvoiceData: any = {};
  @ViewChild('form', { static: false }) form: NgForm;
  @Input() editTable = true;
  @Output() success: EventEmitter<any> = new EventEmitter();
  _dataSource: any;
  get dataSource(): any {
    return this._dataSource;
  }
  @Input() set dataSource(value: any) {
    this._dataSource = value;
    if (this.dataSource && this.dataSource.items && this.dataSource.items.length > 0) {
      // Push treeNode xử lý để tính thuế
      this.dataSource.treeNodes = [...this.dataSource.items];
    }
  }
  public taxCodeRequestPayload = new TaxCodeRequestPayload();
  public taxPayers = config.TAX_PAYER;
  public headers = config.HEADERS;
  public headerTaxCode = config.HEADER_TAX_CODE;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public configListDataTax: any[];
  public isEditVatTax = false;
  public exchangeRateData: any = {};
  public notificationData: any = {};
  public purchaseInvoiceItems: any = {};
  public exchangeRateTypeData: any = [];
  public isDisabledConversionRate = true;
  public isShowExchangeContractorTax = false;
  // Default tính thuế nhà thầu theo công thức
  public accordingFormula = true;
  public editTableContractorTaxExchange = false;
  // Tổng tiền bảng quy đổi cộng line hàng
  public revenueWithoutTaxExchangeTotal = 0;
  public corporateTaxExchangeTotal = 0;
  public revenueCorporateTaxExchangeTotal = 0;
  public vatTaxExchangeTotal = 0;
  public revenueVatTaxExchangeTotal = 0;

  constructor(
    public purchaseInvoiceService: PurchaseInvoiceService,
    private purchaseInvoiceItemService: PurchaseInvoiceItemService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public taxCodeService: TaxCodeService,
    public exchangeRateService: ExchangeRateService,
    public notificationListService: NotificationListService,
    public exchangeRateTypeService: ExchangeRateTypeService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit() {
    setTimeout(() => {
      this.configListDataTax = ConfigListFactory.instant('TAX');
    }, 0);
    this.getConfigExchangeRate();
  }

  ngAfterViewInit() {
    if (this.form) {
      setTimeout(() => {
        this.form.form.markAsPristine();
      }, 50);
    }
  }

  public getConfigExchangeRate(): void {
    this.exchangeRateTypeService.select().subscribe(res => {
      if (res) {
        this.exchangeRateTypeData = res;
      } else {
        this.exchangeRateTypeData = {};
      }
    });

    // Nếu có tỷ giá của thuế nhà thầu thì show bảng quy đổi
    if (this.purchaseInvoiceData.conversionRateTax) {
      this.isShowExchangeContractorTax = true;
      this.exchangeRateData.type = this.purchaseInvoiceData.erTypeTax;
      this.exchangeRateData.date = this.purchaseInvoiceData.erDateTax;
      this.exchangeRateData.conversionRate = this.purchaseInvoiceData.conversionRateTax;
      // TODO tạm fix type user nhập cho phép nhập tỉ giá
      if (this.exchangeRateData.type === 'User') {
        this.isDisabledConversionRate = false;
      } else {
        this.isDisabledConversionRate = true;
      }
    } else {
      if (this.editTable) {
        this.exchangeRateData.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      }
    }

    if (this.purchaseInvoiceData.currency) {
      this.exchangeRateData.currencyFrom = this.purchaseInvoiceData.currency;
    }
    this.exchangeRateData.currencyTo = 'VND';
  }
  //
  public onRowEditInit(): void {
    if (this.form) {
      this.form.form.markAsDirty();
    }
  }
  // Doanh thu chưa thuế
  public onChangeRowRevenueWithoutTaxEditInit(event: any, rowData: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.revenueWithoutTax = 0;
      } else {
        rowData.revenueWithoutTax = event.target.value;
      }

      if (rowData.taxpayer && rowData.taxpayer === 1 && this.accordingFormula === true) {
        // Doanh thu có thuế TNDN (Thông qua Doanh thu chưa thuế và Thuế suất TNDN (%)	)
        if (rowData.corporateTaxRate !== null && rowData.corporateTaxRate !== undefined && rowData.revenueWithoutTax) {
          rowData.revenueCorporateTax = (rowData.revenueWithoutTax * 100) / (100 - rowData.corporateTaxRate);
        }
        // Tính Thuế TNDN ( Doanh thu có thuế TNDN -  Doanh thu chưa thuế)
        if (rowData.revenueCorporateTax && rowData.revenueWithoutTax) {
          rowData.corporateTax = rowData.revenueCorporateTax - rowData.revenueWithoutTax;
        }
        // Doanh thu có thuế VAT (Doanh thu có thuế TNDN/(1 - Thuế suất VAT))
        if (rowData.vatTaxRate !== null && rowData.vatTaxRate !== undefined && rowData.revenueCorporateTax) {
          rowData.revenueVatTax = (rowData.revenueCorporateTax * 100) / (100 - rowData.vatTaxRate);
        }
        // Thuế VAT (Doanh thu có thuế VAT - Doanh thu có thuế TNDN)
        if (rowData.revenueCorporateTax && rowData.revenueVatTax) {
          rowData.vatTax = rowData.revenueVatTax - rowData.revenueCorporateTax;
        }
      }
      this.checkMarkAsDirtyForm(rowData);
    }
  }
  // Doanh thu có thuế TNDN
  public onRowEditRevenueCorporateTaxInit(event: any, rowData: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.revenueCorporateTax = 0;
      } else {
        rowData.revenueCorporateTax = event.target.value;
      }
      if (rowData.taxpayer && rowData.taxpayer === 1 && this.accordingFormula === true) {
        if (rowData.revenueCorporateTax && rowData.revenueWithoutTax) {
          // Tính Thuế TNDN ( Doanh thu có thuế TNDN -  Doanh thu chưa thuế)
          rowData.corporateTax = rowData.revenueCorporateTax - rowData.revenueWithoutTax;
        }
        // Doanh thu có thuế VAT (Doanh thu có thuế TNDN/(1 - Thuế suất VAT))
        if (rowData.vatTaxRate !== null && rowData.vatTaxRate !== undefined && rowData.revenueCorporateTax) {
          rowData.revenueVatTax = (rowData.revenueCorporateTax * 100) / (100 - rowData.vatTaxRate);
        }
        // Thuế VAT (Doanh thu có thuế VAT - Doanh thu có thuế TNDN)
        if (rowData.revenueCorporateTax && rowData.revenueVatTax) {
          rowData.vatTax = rowData.revenueVatTax - rowData.revenueCorporateTax;
        }
      }
      if (rowData.taxpayer && rowData.taxpayer === 2 && this.accordingFormula === true) {
        // Thuế TNDN (Thông qua Doanh thu có thuế TNDN và Thuế suất TNDN (%)	)
        if (rowData.corporateTaxRate !== null && rowData.corporateTaxRate !== undefined && rowData.revenueCorporateTax) {
          rowData.corporateTax = (rowData.revenueCorporateTax * rowData.corporateTaxRate) / 100;
        }
        // Tính Doanh thu chưa thuế ( Doanh thu có thuế TNDN -  Thuế TNDN )
        if (rowData.revenueCorporateTax && rowData.corporateTax) {
          rowData.revenueWithoutTax = rowData.revenueCorporateTax - rowData.corporateTax;
        }
      }
      if (rowData.taxpayer && rowData.taxpayer === 3 && this.accordingFormula === true) {
        // Thuế TNDN (Thông qua Doanh thu có thuế TNDN và Thuế suất TNDN (%)	)
        if (rowData.corporateTaxRate !== null && rowData.corporateTaxRate !== undefined && rowData.revenueCorporateTax) {
          rowData.corporateTax = (rowData.revenueCorporateTax * rowData.corporateTaxRate) / 100;
        }
        // Tính Doanh thu chưa thuế ( Doanh thu có thuế TNDN -  Thuế TNDN )
        if (rowData.revenueCorporateTax && rowData.corporateTax) {
          rowData.revenueWithoutTax = rowData.revenueCorporateTax - rowData.corporateTax;
        }
        // Doanh thu có thuế VAT (Doanh thu có thuế TNDN * 100)/ (100 - Thuế suất VAT)
        if (rowData.vatTaxRate !== null && rowData.vatTaxRate !== undefined && rowData.revenueCorporateTax) {
          rowData.revenueVatTax = (rowData.revenueCorporateTax * 100) / (100 - rowData.vatTaxRate);
        }
        // Thuế VAT (Doanh thu có thuế VAT - Doanh thu có thuế TNDN)
        if (rowData.revenueCorporateTax && rowData.revenueVatTax) {
          rowData.vatTax = rowData.revenueVatTax - rowData.revenueCorporateTax;
        }
      }
      this.checkMarkAsDirtyForm(rowData);
    }
  }

  // Doanh thu có thuế VAT
  public onRowEditRevenueVatTaxInit(rowData: any, event: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.revenueVatTax = 0;
      } else {
        rowData.revenueVatTax = event.target.value;
      }
      if (rowData.taxpayer && rowData.taxpayer === 1 && this.accordingFormula === true) {
        // Thuế VAT (Doanh thu có thuế VAT - Doanh thu có thuế TNDN)
        if (rowData.revenueCorporateTax && rowData.revenueVatTax) {
          rowData.vatTax = rowData.revenueVatTax - rowData.revenueCorporateTax;
        }
      }
      if (rowData.taxpayer && rowData.taxpayer === 2 && this.accordingFormula === true) {
        // Tính Thuế VAT (Thông qua Doanh thu chưa thuế và Thuế suất VAT)
        if (rowData.vatTaxRate !== null && rowData.vatTaxRate !== undefined && rowData.revenueVatTax) {
          rowData.vatTax = (rowData.vatTaxRate * rowData.revenueVatTax) / 100;
        }
        // Doanh thu có thuế TNDN (Doanh thu có thuế VAT - Thuế VAT)
        if (rowData.revenueVatTax && rowData.vatTax) {
          rowData.revenueCorporateTax = rowData.revenueVatTax - rowData.vatTax;
        }
        // Thuế TNDN (Thông qua Doanh thu có thuế TNDN và Thuế suất TNDN (%)	)
        if (rowData.corporateTaxRate !== null && rowData.corporateTaxRate !== undefined && rowData.revenueCorporateTax) {
          rowData.corporateTax = (rowData.revenueCorporateTax * rowData.corporateTaxRate) / 100;
        }
        // Tính Doanh thu chưa thuế ( Doanh thu có thuế TNDN -  Thuế TNDN )
        if (rowData.revenueCorporateTax && rowData.corporateTax) {
          rowData.revenueWithoutTax = rowData.revenueCorporateTax - rowData.corporateTax;
        }
      }
      if (rowData.taxpayer && rowData.taxpayer === 3 && this.accordingFormula === true) {
        // Thuế VAT (Doanh thu có thuế VAT - Doanh thu có thuế TNDN)
        if (rowData.revenueCorporateTax && rowData.revenueVatTax) {
          rowData.vatTax = rowData.revenueVatTax - rowData.revenueCorporateTax;
        }
      }
      this.checkMarkAsDirtyForm(rowData);
    }
  }

  // Change percent Thuế suất TNDN (%)
  public onChangeRowEditCorporateTaxRate(rowData?: any, event?: any): void {
    rowData.corporateTaxRate = event ? +event.name : rowData.corporateTaxRate;
    if (event === null || event === undefined) {
      rowData.corporateTaxRate = null;
      if (rowData.taxpayer && rowData.taxpayer === 1 && this.accordingFormula === true) {
        rowData.revenueCorporateTax = null;
        rowData.corporateTax = null;
      }
      if (rowData.taxpayer && (rowData.taxpayer === 2 || rowData.taxpayer === 3) && this.accordingFormula === true) {
        rowData.revenueWithoutTax = null;
        rowData.revenueCorporateTax = null;
      }
    } else {
      if (rowData.taxpayer && rowData.taxpayer === 1 && this.accordingFormula === true) {
        // Doanh thu có thuế TNDN (Thông qua Doanh thu chưa thuế và Thuế suất TNDN (%)	)
        if (rowData.corporateTaxRate !== null && rowData.corporateTaxRate !== undefined
          && rowData.revenueWithoutTax !== null && rowData.revenueWithoutTax !== undefined) {
          rowData.revenueCorporateTax = (rowData.revenueWithoutTax * 100) / (100 - rowData.corporateTaxRate);
        }
        // Tính Thuế TNDN ( Doanh thu có thuế TNDN -  Doanh thu chưa thuế)
        if (rowData.revenueCorporateTax !== null && rowData.revenueCorporateTax !== undefined
          && rowData.revenueWithoutTax !== null && rowData.revenueWithoutTax !== undefined) {
          rowData.corporateTax = rowData.revenueCorporateTax - rowData.revenueWithoutTax;
        }
      }
      if (rowData.taxpayer && (rowData.taxpayer === 2 || rowData.taxpayer === 3) && this.accordingFormula === true) {
        // Thuế TNDN (Thông qua Doanh thu có thuế TNDN và Thuế suất TNDN (%)	)
        if (rowData.corporateTaxRate !== null && rowData.corporateTaxRate !== undefined
          && rowData.revenueCorporateTax !== null && rowData.revenueCorporateTax !== undefined) {
          rowData.corporateTax = (rowData.revenueCorporateTax * rowData.corporateTaxRate) / 100;
        }
        // Tính Doanh thu chưa thuế ( Doanh thu có thuế TNDN -  Thuế TNDN )
        if (rowData.revenueCorporateTax !== null && rowData.revenueCorporateTax !== undefined
          && rowData.corporateTax !== null && rowData.corporateTax !== undefined) {
          rowData.revenueWithoutTax = rowData.revenueCorporateTax - rowData.corporateTax;
        }
      }

      if (event) {
        this.onChangeRowEditVatTaxRate(rowData, false);
      }
    }
    this.checkMarkAsDirtyForm(rowData);

  }

  // Change percent Thuế suất VAT (%)
  public onChangeRowEditVatTaxRate(rowData?: any, event?: any): void {
    rowData.vatTaxRate = event ? +event.name : rowData.vatTaxRate;
    if (event === null || event === undefined) {
      rowData.vatTaxRate = null;
      if (rowData.taxpayer && rowData.taxpayer === 1 && this.accordingFormula === true) {
        rowData.revenueVatTax = null;
        rowData.vatTax = null;
      }
      if (rowData.taxpayer && rowData.taxpayer === 2 && this.accordingFormula === true) {
        rowData.vatTax = null;
        rowData.revenueCorporateTax = null;
      }
      if (rowData.taxpayer && rowData.taxpayer === 3 && this.accordingFormula === true) {
        rowData.revenueVatTax = null;
        rowData.vatTax = null;
      }

    } else {
      if (rowData.taxpayer && rowData.taxpayer === 1 && this.accordingFormula === true) {
        // Doanh thu có thuế VAT (Doanh thu có thuế TNDN/(1 - Thuế suất VAT))
        if (rowData.vatTaxRate !== null && rowData.vatTaxRate !== undefined
          && rowData.revenueCorporateTax !== null && rowData.revenueCorporateTax !== undefined) {
          rowData.revenueVatTax = (rowData.revenueCorporateTax * 100) / (100 - rowData.vatTaxRate);
        }
        // Thuế VAT (Doanh thu có thuế VAT - Doanh thu có thuế TNDN)
        if (rowData.revenueVatTax !== null && rowData.revenueVatTax !== undefined
          && rowData.revenueCorporateTax !== null && rowData.revenueCorporateTax !== undefined) {
          rowData.vatTax = rowData.revenueVatTax - rowData.revenueCorporateTax;
        }
      }
      if (event) {
        if (rowData.taxpayer && rowData.taxpayer === 2 && this.accordingFormula === true) {
          // Tính Thuế VAT (Thông qua Doanh thu chưa thuế và Thuế suất VAT)
          if (rowData.vatTaxRate !== null && rowData.vatTaxRate !== undefined
            && rowData.revenueVatTax !== null && rowData.revenueVatTax !== undefined) {
            rowData.vatTax = (rowData.vatTaxRate * rowData.revenueVatTax) / 100;
          }
          // Doanh thu có thuế TNDN (Doanh thu có thuế VAT - Thuế VAT)
          if (rowData.revenueVatTax && rowData.vatTax) {
            rowData.revenueCorporateTax = rowData.revenueVatTax - rowData.vatTax;
          }
        }
        if (rowData.taxpayer && rowData.taxpayer === 3 && this.accordingFormula === true) {
          // Doanh thu có thuế VAT (Doanh thu có thuế TNDN * 100)/ (100 - Thuế suất VAT)
          if (rowData.vatTaxRate !== null && rowData.vatTaxRate !== undefined
            && rowData.revenueCorporateTax !== null && rowData.revenueCorporateTax !== undefined) {
            rowData.revenueVatTax = (rowData.revenueCorporateTax * 100) / (100 - rowData.vatTaxRate);
          }
          // Thuế VAT (Doanh thu có thuế VAT - Doanh thu có thuế TNDN)
          if (rowData.revenueVatTax !== null && rowData.revenueVatTax !== undefined
            && rowData.revenueCorporateTax !== null && rowData.revenueCorporateTax !== undefined) {
            rowData.vatTax = rowData.revenueVatTax - rowData.revenueCorporateTax;
          }
        }
        if (event) {
          this.onChangeRowEditCorporateTaxRate(rowData, false);
        }
      }
    }
    this.checkMarkAsDirtyForm(rowData);
  }

  public onRowEditCancel(rowData: any): void {

  }

  // Thuế VAT
  public onRowEditInitVatTax(rowData: any, event: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.vatTax = 0;
      } else {
        rowData.vatTax = event.target.value;
      }
      if (rowData.taxpayer && rowData.taxpayer === 2 && this.accordingFormula === true) {
        // Tính Doanh thu có thuế TNDN ( Doanh thu có thuế VAT -  Thuế VAT )
        if (rowData.revenueVatTax && rowData.vatTax) {
          rowData.revenueCorporateTax = rowData.revenueVatTax - rowData.vatTax;
        }
        // Thuế TNDN (Thông qua Doanh thu có thuế TNDN và Thuế suất TNDN (%)	)
        if (rowData.corporateTaxRate !== null && rowData.corporateTaxRate !== undefined && rowData.revenueCorporateTax) {
          rowData.corporateTax = (rowData.revenueCorporateTax * rowData.corporateTaxRate) / 100;
        }
        // Tính Doanh chưa thuế ( Doanh thu có thuế TNDN -  Thuế TNDN )
        if (rowData.revenueCorporateTax && rowData.corporateTax) {
          rowData.revenueWithoutTax = rowData.revenueCorporateTax - rowData.corporateTax;
        }
      }
      this.checkMarkAsDirtyForm(rowData);
    }
  }
  // Thuế TNDN
  public onRowEditInitCorporateTax(rowData: any, event: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.corporateTax = 0;
      } else {
        rowData.corporateTax = event.target.value;
      }
      if (rowData.taxpayer && (rowData.taxpayer === 2 || rowData.taxpayer === 3) && this.accordingFormula === true) {
        // Tính Doanh chưa thuế ( Doanh thu có thuế TNDN -  Thuế TNDN )
        if (rowData.revenueCorporateTax && rowData.corporateTax) {
          rowData.revenueWithoutTax = rowData.revenueCorporateTax - rowData.corporateTax;
        }
      }
      this.checkMarkAsDirtyForm(rowData);
    }
  }

  public checkMarkAsDirtyForm(rowData?: any): void {
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    // Tính theo công thức mới tự động làm tròn
    if (this.accordingFormula === true && this.purchaseInvoiceData.currency === 'VND') {
      // Làm tròn đến 0 chữ số thập phân nếu loại tiền hóa đơn là VND
      rowData.revenueWithoutTax = rowData.revenueWithoutTax ? (+rowData.revenueWithoutTax).toFixed(0) : null;
      rowData.corporateTax = rowData.corporateTax ? (+rowData.corporateTax).toFixed(0) : null;
      rowData.revenueCorporateTax = rowData.revenueCorporateTax ? (+rowData.revenueCorporateTax).toFixed(0) : null;
      rowData.vatTax = rowData.vatTax ? (+rowData.vatTax).toFixed(0) : null;
      rowData.revenueVatTax = rowData.revenueVatTax ? (+rowData.revenueVatTax).toFixed(0) : null;
    }

    this.getTotalContractorTax();
  }

  public onRowSaveClick(rowData: any): void {
    if (rowData) {
      // Save rowData
      this.purchaseInvoiceItemService
        .merge(rowData)
        .subscribe((res) => {
          this.notificationService.showSuccess();
          this.cdr.detectChanges();
        });
    }
    this.getTotalContractorTax();
  }

  public onChangeType(): void {
    // TODO tạm fix type user nhập cho phép nhập tỉ giá
    if (this.exchangeRateData.type === 'User') {
      this.isDisabledConversionRate = false;
    } else {
      this.isDisabledConversionRate = true;
    }
    this.getConversionRate();
  }

  public onChangeDate(): void {
    this.getConversionRate();
  }

  private getConversionRate(): void {
    this.exchangeRateData.conversionRate = null;
    const request = new ExchangeRateRequestPayload();
    request.type = this.exchangeRateData.type;
    request.date = this.exchangeRateData.date;
    request.currencyFrom = this.exchangeRateData.currencyFrom;
    request.currencyTo = this.exchangeRateData.currencyTo;
    this.exchangeRateService.select(request).subscribe(res => {
      if (res) {
        this.exchangeRateData.conversionRate = res[0] ? res[0].conversionRate : null;
      } else {
        this.exchangeRateData.conversionRate = null;
      }
      this.cdr.detectChanges();
    });
  }

  // Quy đổi thuế nhà thầu
  public exchangeContractorTax(): void {
    this.isShowExchangeContractorTax = false;
    if (this.exchangeRateData.conversionRate) {
      this.processingConversionRate();
      this.onRowEditInit();
    } else {
      if (this.purchaseInvoiceData.currency !== 'VND') {
        this.notificationService.showWarning('Không thể quy đổi, vui lòng chọn thông tin tỷ giá !!!');
      }
    }
  }

  public onChangeConversionRate(event: any): void {
    if (event) {
      this.exchangeRateData.conversionRate = event;
      if (this.exchangeRateData.conversionRate === 0
        || this.exchangeRateData.conversionRate === null
        || this.exchangeRateData.conversionRate === undefined
        || this.exchangeRateData.conversionRate === '') {
        this.isShowExchangeContractorTax = false;
      }
    }
    this.getTotalContractorTax();
  }

  public processingConversionRate(): void {
    this.isShowExchangeContractorTax = true;
    this.dataSource.treeNodes.map(parent => {
      if (parent.data) {
        this.conversionValue(parent.data);
      }
      if (parent.children && parent.children.length > 0) {
        parent.children.map(chil => {
          if (chil.data) {
            this.conversionValue(chil.data);
          }
        });
      }
      return parent;
    });
    this.getTotalContractorTax();
  }

  public conversionValue(rowData): void {
    // Bảng quy đổi các line: lấy tiền lẻ nhân với tỷ giá, nhân xong mới lấy kết quả đó làm tròn, không lấy số sau dấu thập phân
    const conversionRate = this.exchangeRateData.conversionRate;
    if (rowData.revenueWithoutTax !== null && rowData.revenueWithoutTax !== undefined) {
      rowData.revenueWithoutTaxExchange = +(+rowData.revenueWithoutTax * conversionRate).toFixed(0);
    } else {
      rowData.revenueWithoutTaxExchange = null;
    }

    if (rowData.corporateTax !== null && rowData.corporateTax !== undefined) {
      rowData.corporateTaxExchange = +(+rowData.corporateTax * conversionRate).toFixed(0);
    } else {
      rowData.corporateTaxExchange = null;
    }

    if (rowData.revenueCorporateTax !== null && rowData.revenueCorporateTax !== undefined) {
      rowData.revenueCorporateTaxExchange = +(+rowData.revenueCorporateTax * conversionRate).toFixed(0);
    } else {
      rowData.revenueCorporateTaxExchange = null;
    }

    if (rowData.vatTax !== null && rowData.vatTax !== undefined) {
      rowData.vatTaxExchange = +(+rowData.vatTax * conversionRate).toFixed(0);
    } else {
      rowData.vatTaxExchange = null;
    }

    if (rowData.revenueVatTax !== null && rowData.revenueVatTax !== undefined) {
      rowData.revenueVatTaxExchange = +(+rowData.revenueVatTax * conversionRate).toFixed(0);
    } else {
      rowData.revenueVatTaxExchange = null;
    }

  }

  private getTotalContractorTax(): void {
    if (this.dataSource && this.dataSource.treeNodes && this.dataSource.treeNodes.length > 0) {
      this.treeNodeToItemSource();
      const conversionRate = this.exchangeRateData.conversionRate;
      // Tính Total bảng chưa quy đổi
      let revenueWithoutTaxTotal = 0;
      let corporateTaxTotal = 0;
      let revenueCorporateTaxTotal = 0;
      let vatTaxTotal = 0;
      let revenueVatTaxTotal = 0;
      // Tính Total bảng quy đổi
      let revenueWithoutTaxExchangeTotal = 0;
      let corporateTaxExchangeTotal = 0;
      let revenueCorporateTaxExchangeTotal = 0;
      let vatTaxExchangeTotal = 0;
      let revenueVatTaxExchangeTotal = 0;
      // const rs = [];
      for (const element of this.dataSource.treeNodes) {
        if (element.data) {
          const itemParent = element.data;
          // Tính Total bảng chưa quy đổi
          revenueWithoutTaxTotal += +itemParent.revenueWithoutTax ? +itemParent.revenueWithoutTax : 0;
          corporateTaxTotal += +itemParent.corporateTax ? +itemParent.corporateTax : 0;
          revenueCorporateTaxTotal += +itemParent.revenueCorporateTax ? +itemParent.revenueCorporateTax : 0;
          vatTaxTotal += +itemParent.vatTax ? +itemParent.vatTax : 0;
          revenueVatTaxTotal += +itemParent.revenueVatTax ? +itemParent.revenueVatTax : 0;
          if (conversionRate) {
            // Tính Total bảng quy đổi
            revenueWithoutTaxExchangeTotal += +itemParent.revenueWithoutTaxExchange ? +itemParent.revenueWithoutTaxExchange : 0;
            corporateTaxExchangeTotal += +itemParent.corporateTaxExchange ? +itemParent.corporateTaxExchange : 0;
            revenueCorporateTaxExchangeTotal += +itemParent.revenueCorporateTaxExchange ? +itemParent.revenueCorporateTaxExchange : 0;
            vatTaxExchangeTotal += +itemParent.vatTaxExchange ? +itemParent.vatTaxExchange : 0;
            revenueVatTaxExchangeTotal += +itemParent.revenueVatTaxExchange ? +itemParent.revenueVatTaxExchange : 0;
          }
        }
        if (element.children && element.children.length > 0) {
          for (const temp of element.children) {
            if (temp.data) {
              const itemChildrent = temp.data;
              // Tính Total bảng chưa quy đổi
              revenueWithoutTaxTotal += +itemChildrent.revenueWithoutTax ? +itemChildrent.revenueWithoutTax : 0;
              corporateTaxTotal += +itemChildrent.corporateTax ? +itemChildrent.corporateTax : 0;
              revenueCorporateTaxTotal += +itemChildrent.revenueCorporateTax ? +itemChildrent.revenueCorporateTax : 0;
              vatTaxTotal += +itemChildrent.vatTax ? +itemChildrent.vatTax : 0;
              revenueVatTaxTotal += +itemChildrent.revenueVatTax ? +itemChildrent.revenueVatTax : 0;

              if (conversionRate) {
                // Tính Total bảng quy đổi
                revenueWithoutTaxExchangeTotal += +itemChildrent.revenueWithoutTaxExchange ? +itemChildrent.revenueWithoutTaxExchange : 0;
                corporateTaxExchangeTotal += +itemChildrent.corporateTaxExchange ? +itemChildrent.corporateTaxExchange : 0;
                // tslint:disable-next-line:max-line-length
                revenueCorporateTaxExchangeTotal += +itemChildrent.revenueCorporateTaxExchange ? +itemChildrent.revenueCorporateTaxExchange : 0;
                vatTaxExchangeTotal += +itemChildrent.vatTaxExchange ? +itemChildrent.vatTaxExchange : 0;
                revenueVatTaxExchangeTotal += +itemChildrent.revenueVatTaxExchange ? +itemChildrent.revenueVatTaxExchange : 0;
              }
            }
          }
        }
      }

      // tslint:disable-next-line:max-line-length
      if (revenueWithoutTaxTotal === 0 && !this.purchaseInvoiceItems.find(x => x.revenueWithoutTax !== null && x.revenueWithoutTax !== undefined)) {
        revenueWithoutTaxTotal = null;
        revenueWithoutTaxExchangeTotal = null;
      }
      // tslint:disable-next-line:max-line-length
      if (corporateTaxTotal === 0 && !this.purchaseInvoiceItems.find(x => x.corporateTax !== null && x.corporateTax !== undefined)) {
        corporateTaxTotal = null;
        corporateTaxExchangeTotal = null;
      }
      // tslint:disable-next-line:max-line-length
      if (revenueCorporateTaxTotal === 0 && !this.purchaseInvoiceItems.find(x => x.revenueCorporateTax !== null && x.revenueCorporateTax !== undefined)) {
        revenueCorporateTaxTotal = null;
        revenueCorporateTaxExchangeTotal = null;
      }
      if (vatTaxTotal === 0 && !this.purchaseInvoiceItems.find(x => x.vatTaxTotal !== null && x.vatTaxTotal !== undefined)) {
        vatTaxTotal = null;
        vatTaxExchangeTotal = null;
      }
      // tslint:disable-next-line:max-line-length
      if (revenueVatTaxTotal === 0 && !this.purchaseInvoiceItems.find(x => x.revenueVatTax !== null && x.revenueVatTax !== undefined)) {
        revenueVatTaxTotal = null;
        revenueVatTaxExchangeTotal = null;
      }

      if (this.accordingFormula === true) {
        if (this.purchaseInvoiceData.currency === 'VND') {
          // Tính Total bảng chưa quy đổi
          // NCC chịu or cả hai chịu ==> làm tròn 2 chữ số thập phân
          // tslint:disable-next-line:max-line-length
          this.purchaseInvoiceData.revenueWithoutTaxTotal = revenueWithoutTaxTotal === null ? revenueWithoutTaxTotal : +revenueWithoutTaxTotal.toFixed(0);
          this.purchaseInvoiceData.corporateTaxTotal = corporateTaxTotal === null ? corporateTaxTotal : +corporateTaxTotal.toFixed(0);
          // tslint:disable-next-line:max-line-length
          this.purchaseInvoiceData.revenueCorporateTaxTotal = revenueCorporateTaxTotal === null ? revenueCorporateTaxTotal : +revenueCorporateTaxTotal.toFixed(0);
          this.purchaseInvoiceData.vatTaxTotal = vatTaxTotal === null ? vatTaxTotal : +vatTaxTotal.toFixed(0);
          this.purchaseInvoiceData.revenueVatTaxTotal = revenueVatTaxTotal === null ? revenueVatTaxTotal : +revenueVatTaxTotal.toFixed(0);
        } else {
          if (this.dataSource.treeNodes[0].data.taxpayer === 1) {
            // Tính Total bảng chưa quy đổi
            // FIS chịu ==> tổng tiền ko làm tròn
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.revenueWithoutTaxTotal = revenueWithoutTaxTotal === null ? revenueWithoutTaxTotal : +revenueWithoutTaxTotal;
            this.purchaseInvoiceData.corporateTaxTotal = corporateTaxTotal === null ? corporateTaxTotal : +corporateTaxTotal;
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.revenueCorporateTaxTotal = revenueCorporateTaxTotal === null ? revenueCorporateTaxTotal : +revenueCorporateTaxTotal;
            this.purchaseInvoiceData.vatTaxTotal = vatTaxTotal === null ? vatTaxTotal : +vatTaxTotal;
            this.purchaseInvoiceData.revenueVatTaxTotal = revenueVatTaxTotal === null ? revenueVatTaxTotal : +revenueVatTaxTotal;
          } else {
            // Tính Total bảng chưa quy đổi
            // NCC chịu or cả hai chịu ==> làm tròn 2 chữ số thập phân
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.revenueWithoutTaxTotal = revenueWithoutTaxTotal === null ? revenueWithoutTaxTotal : this.rounding(+revenueWithoutTaxTotal);
            this.purchaseInvoiceData.corporateTaxTotal = corporateTaxTotal === null ? corporateTaxTotal : this.rounding(+corporateTaxTotal);
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.revenueCorporateTaxTotal = revenueCorporateTaxTotal === null ? revenueCorporateTaxTotal : this.rounding(+revenueCorporateTaxTotal);
            this.purchaseInvoiceData.vatTaxTotal = vatTaxTotal === null ? vatTaxTotal : this.rounding(+vatTaxTotal);
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.revenueVatTaxTotal = revenueVatTaxTotal === null ? revenueVatTaxTotal : this.rounding(+revenueVatTaxTotal);
          }
          if (conversionRate) {
            // Tính Total bảng quy đổi ==> không lấy số sau dấu thập phân
            //  Giá trị = cộng line hàng nhân tỷ giá rồi mới làm tròn
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.revenueWithoutTaxExchangeTotal = revenueWithoutTaxTotal === null ? revenueWithoutTaxTotal : +(+revenueWithoutTaxTotal * conversionRate).toFixed(0);
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.corporateTaxExchangeTotal = corporateTaxTotal === null ? corporateTaxTotal : +(+corporateTaxTotal * conversionRate).toFixed(0);
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.revenueCorporateTaxExchangeTotal = revenueCorporateTaxTotal === null ? revenueCorporateTaxTotal : +(+revenueCorporateTaxTotal * conversionRate).toFixed(0);
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.vatTaxExchangeTotal = vatTaxTotal === null ? vatTaxTotal : +(+vatTaxTotal * conversionRate).toFixed(0);
            // tslint:disable-next-line:max-line-length
            this.purchaseInvoiceData.revenueVatTaxExchangeTotal = revenueVatTaxTotal === null ? revenueVatTaxTotal : +(+revenueVatTaxTotal * conversionRate).toFixed(0);


            // Tính Total bảng quy đổi ==> không lấy số sau dấu thập phân
            //  Giá trị = cộng line hàng đã quy đổi rồi làm tròn
            // tslint:disable-next-line:max-line-length
            this.revenueWithoutTaxExchangeTotal = revenueWithoutTaxExchangeTotal === null ? revenueWithoutTaxExchangeTotal : +revenueWithoutTaxExchangeTotal.toFixed(0);
            // tslint:disable-next-line:max-line-length
            this.corporateTaxExchangeTotal = corporateTaxExchangeTotal === null ? corporateTaxExchangeTotal : +corporateTaxExchangeTotal.toFixed(0);
            // tslint:disable-next-line:max-line-length
            this.revenueCorporateTaxExchangeTotal = revenueCorporateTaxExchangeTotal === null ? revenueCorporateTaxExchangeTotal : +revenueCorporateTaxExchangeTotal.toFixed(0);
            // tslint:disable-next-line:max-line-length
            this.vatTaxExchangeTotal = vatTaxExchangeTotal === null ? vatTaxExchangeTotal : +vatTaxExchangeTotal.toFixed(0);
            // tslint:disable-next-line:max-line-length
            this.revenueVatTaxExchangeTotal = revenueVatTaxExchangeTotal === null ? revenueVatTaxExchangeTotal : +revenueVatTaxExchangeTotal.toFixed(0);
          }
        }
      } else {
        // Tính Total bảng chưa quy đổi
        // tslint:disable-next-line:max-line-length
        this.purchaseInvoiceData.revenueWithoutTaxTotal = revenueWithoutTaxTotal === null ? revenueWithoutTaxTotal : +revenueWithoutTaxTotal;
        this.purchaseInvoiceData.corporateTaxTotal = corporateTaxTotal === null ? corporateTaxTotal : +corporateTaxTotal;
        // tslint:disable-next-line:max-line-length
        this.purchaseInvoiceData.revenueCorporateTaxTotal = revenueCorporateTaxTotal === null ? revenueCorporateTaxTotal : +revenueCorporateTaxTotal;
        this.purchaseInvoiceData.vatTaxTotal = vatTaxTotal === null ? vatTaxTotal : +vatTaxTotal;
        this.purchaseInvoiceData.revenueVatTaxTotal = revenueVatTaxTotal === null ? revenueVatTaxTotal : +revenueVatTaxTotal;
        if (conversionRate) {
          // Tính Total bảng quy đổi
          // tslint:disable-next-line:max-line-length
          this.purchaseInvoiceData.revenueWithoutTaxExchangeTotal = revenueWithoutTaxExchangeTotal === null ? revenueWithoutTaxExchangeTotal : +revenueWithoutTaxExchangeTotal;
          // tslint:disable-next-line:max-line-length
          this.purchaseInvoiceData.corporateTaxExchangeTotal = corporateTaxExchangeTotal === null ? corporateTaxExchangeTotal : +corporateTaxExchangeTotal;
          // tslint:disable-next-line:max-line-length
          this.purchaseInvoiceData.revenueCorporateTaxExchangeTotal = revenueCorporateTaxExchangeTotal === null ? revenueCorporateTaxExchangeTotal : +revenueCorporateTaxExchangeTotal;
          this.purchaseInvoiceData.vatTaxExchangeTotal = vatTaxExchangeTotal === null ? vatTaxExchangeTotal : +vatTaxExchangeTotal;
          // tslint:disable-next-line:max-line-length
          this.purchaseInvoiceData.revenueVatTaxExchangeTotal = revenueVatTaxExchangeTotal === null ? revenueVatTaxExchangeTotal : +revenueVatTaxExchangeTotal;



          // Tính Total bảng quy đổi
          //  Giá trị = cộng line hàng đã quy đổi
          // tslint:disable-next-line:max-line-length
          this.revenueWithoutTaxExchangeTotal = revenueWithoutTaxExchangeTotal === null ? revenueWithoutTaxExchangeTotal : +revenueWithoutTaxExchangeTotal;
          this.corporateTaxExchangeTotal = corporateTaxExchangeTotal === null ? corporateTaxExchangeTotal : +corporateTaxExchangeTotal;
          // tslint:disable-next-line:max-line-length
          this.revenueCorporateTaxExchangeTotal = revenueCorporateTaxExchangeTotal === null ? revenueCorporateTaxExchangeTotal : +revenueCorporateTaxExchangeTotal;
          this.vatTaxExchangeTotal = vatTaxExchangeTotal === null ? vatTaxExchangeTotal : +vatTaxExchangeTotal;
          this.revenueVatTaxExchangeTotal = revenueVatTaxExchangeTotal === null ? revenueVatTaxExchangeTotal : +revenueVatTaxExchangeTotal;
        }
      }
    }
  }

  public onBtnSaveContractTaxClick(): void {
    if (this.form.form.dirty) {
      this.purchaseInvoiceData.erDateTax = this.exchangeRateData.date;
      this.purchaseInvoiceData.erTypeTax = this.exchangeRateData.type;
      this.purchaseInvoiceData.conversionRateTax = this.exchangeRateData.conversionRate;
      this.treeNodeToItemSource();

      // Check quy đổi thuế nhà thầu
      const conversionRate = this.exchangeRateData.conversionRate;
      if (this.purchaseInvoiceData.currency !== 'VND' && conversionRate) {
        let isExchangeContractorTax = false;
        for (const item of this.purchaseInvoiceItems) {
          if ((item.revenueWithoutTaxExchange !== null && item.revenueWithoutTaxExchange !== undefined)
            || (item.corporateTaxExchange !== null && item.corporateTaxExchange !== undefined)
            || (item.revenueCorporateTaxExchange !== null && item.revenueCorporateTaxExchange !== undefined)
            || (item.vatTaxExchange !== null && item.vatTaxExchange !== undefined)
            || (item.revenueVatTaxExchange !== null && item.revenueVatTaxExchange !== undefined)
          ) {
            isExchangeContractorTax = true;
            break;
          }
        }
        if (!isExchangeContractorTax) {
          this.notificationService.showWarning('Vui lòng quy đổi thuế nhà thầu trước khi lưu');
          return;
        }
        let isShowWarning = false;
        if (!isShowWarning && this.purchaseInvoiceData.revenueWithoutTaxExchangeTotal !== null &&
          this.revenueWithoutTaxExchangeTotal !== this.purchaseInvoiceData.revenueWithoutTaxExchangeTotal) {
          this.notificationService.showWarning('Doanh thu chưa thuế bảng quy đổi : Tổng tiền ở các line hàng đang lệch so với số tổng');
          isShowWarning = true;
        }

        if (!isShowWarning && this.purchaseInvoiceData.corporateTaxExchangeTotal !== null &&
          this.corporateTaxExchangeTotal !== this.purchaseInvoiceData.corporateTaxExchangeTotal) {
          this.notificationService.showWarning('Thuế TNDN bảng quy đổi : Tổng tiền ở các line hàng đang lệch so với số tổng');
          isShowWarning = true;
        }

        if (!isShowWarning && this.purchaseInvoiceData.revenueCorporateTaxExchangeTotal !== null &&
          this.revenueCorporateTaxExchangeTotal !== this.purchaseInvoiceData.revenueCorporateTaxExchangeTotal) {
          this.notificationService.showWarning('Doanh thu có thuế TNDN bảng quy đổi : Tổng tiền ở các line hàng đang lệch so với số tổng');
          isShowWarning = true;
        }

        if (!isShowWarning && this.purchaseInvoiceData.vatTaxExchangeTotal !== null &&
          this.vatTaxExchangeTotal !== this.purchaseInvoiceData.vatTaxExchangeTotal) {
          this.notificationService.showWarning('Thuế VAT bảng quy đổi : Tổng tiền ở các line hàng đang lệch so với số tổng');
          isShowWarning = true;
        }

        if (!isShowWarning && this.purchaseInvoiceData.revenueVatTaxExchangeTotal !== null &&
          this.revenueVatTaxExchangeTotal !== this.purchaseInvoiceData.revenueVatTaxExchangeTotal) {
          this.notificationService.showWarning('Doanh thu có thuế VAT bảng quy đổi : Tổng tiền ở các line hàng đang lệch so với số tổng');
        }

      }

      const requestSave = new PurchaseInvoiceRequestSaveTaxDto();
      requestSave.purchaseInvoiceContractorTax = this.purchaseInvoiceData;
      requestSave.purchaseInvoiceItemsContractorTax = this.purchaseInvoiceItems;
      const saveConfirmation = new CustomConfirmation('Bạn chắc chắn muốn lưu thông tin thay đổi trên tab thông tin thuế nhà thầu ??');
      saveConfirmation.accept = () => {
        this.purchaseInvoiceService.UpdateContractorTax(requestSave).subscribe(res => {
          if (res) {
            this.notificationService.showSuccess();
            this.success.emit(res);
            this.form.form.markAsPristine();
            this.cdr.detectChanges();
          }
        });
      };
      this.notificationService.confirm(saveConfirmation);
    }
  }

  public onBtnCancelClick(): void {
    this.router.navigate([`../../../list`]);
  }

  private treeNodeToItemSource(): void {
    this.purchaseInvoiceItems = [];
    for (const parentNode of this.dataSource.treeNodes) {
      this.purchaseInvoiceItems.push(parentNode.data);
      for (const childNode of parentNode.children) {
        this.purchaseInvoiceItems.push(childNode.data);
      }
    }
  }

  // event gửi xuất nhập khẩu
  public onBtnSendTaxInfoClick(): void {
    if (this.form.dirty) {
      this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_006');
      return;
    }
    if (!this.purchaseInvoiceData.conversionRateTax && this.purchaseInvoiceData.currency !== 'VND') {
      this.notificationService.showWarning('Vui lòng quy đổi thuế nhà thầu');
      return;
    }

    const corporateTaxTotal = this.purchaseInvoiceData.corporateTaxTotal ? +this.purchaseInvoiceData.corporateTaxTotal : 0;
    const vatTaxTotal = this.purchaseInvoiceData.vatTaxTotal ? +this.purchaseInvoiceData.vatTaxTotal : 0;

    this.purchaseInvoiceData.corporateTaxExchangeTotal = this.purchaseInvoiceData.corporateTaxExchangeTotal;
    this.purchaseInvoiceData.corporateTaxTotal = this.purchaseInvoiceData.corporateTaxTotal;
    this.purchaseInvoiceData.corporateAndVatAmount = corporateTaxTotal + vatTaxTotal;

    this.purchaseInvoiceData.isGenerateTaxInvoice = true;
    if (this.purchaseInvoiceData.corporateTaxTotal === 0) {
      // Trường hợp nhập thuế suất = 0 vẫn cho gửi thông báo XNK nhưng không sinh hoá đơn thuế
      if (this.dataSource.treeNodes.find(x => x.data.corporateTaxRate !== null && x.data.corporateTaxRate !== undefined)) {
        this.purchaseInvoiceData.isGenerateTaxInvoice = false;
      } else {
        this.notificationService.showWarning('Vui lòng tính thuế nhà thầu');
        return;
      }
    }
    const customConfirmation = new CustomConfirmation('Bạn có chắc chắn muốn gửi XNK');
    customConfirmation.accept = () => {
      this.purchaseInvoiceData.taxStatus = 4; // Đổi trạng thái sang Hoàn thành
      // Lấy thông tin từ item
      this.purchaseInvoiceData.taxpayer = this.dataSource.treeNodes[0].data.taxpayer;
      this.purchaseInvoiceData.termAccount = this.dataSource.treeNodes[0].data.termAccount;
      const itemSrv = this.dataSource.treeNodes.find(x => x.data.itemType === 'SRV' && x.data.isUpdateSrv);
      if (itemSrv) {
        this.purchaseInvoiceData.itemType = 'SRV';
        this.purchaseInvoiceData.termAccount = itemSrv.data.termAccount;
      } else {
        // không tìm thấy default bất kỳ HW, SW
        this.purchaseInvoiceData.itemType = 'HW';
      }

      // Lấy project code theo line hàng để tạo hoá đơn thuế
      if (this.dataSource.treeNodes.length > 0) {
        this.purchaseInvoiceData.projectCodeItem = this.dataSource.treeNodes[0].data.projectCode;
      }
      this.purchaseInvoiceService.merge(this.purchaseInvoiceData).subscribe(m => {
        this.purchaseInvoiceData.taxStatus = 4;
        this.cdr.detectChanges();
        this.notificationService.showSuccess();
      });
    };
    this.notificationService.confirm(customConfirmation);
  }

  public onChangeAccordingFormula(event: any) {
    if (event) {
      this.accordingFormula = !this.accordingFormula;
    }
  }

  public onChangeTableContractorTaxExchange(event: any) {
    if (event) {
      this.editTableContractorTaxExchange = !this.editTableContractorTaxExchange;
    }
  }

  // Tổng doanh thu chưa thuế
  public onRowEditRevenueWithoutTaxTotalInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.revenueWithoutTaxTotal = 0;
      } else {
        this.purchaseInvoiceData.revenueWithoutTaxTotal = event.target.value;
      }
      if (this.form) {
        this.form.form.markAsDirty();
      }
    }
  }

  // Tổng thuế TNDN
  public onRowEditCorporateTaxTotalInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.corporateTaxTotal = 0;
      } else {
        this.purchaseInvoiceData.corporateTaxTotal = event.target.value;
      }
      if (this.form) {
        this.form.form.markAsDirty();
      }
    }
  }

  // Tổng doanh thu có thuế TNDN
  public onRowEditRevenueCorporateTaxTotalInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.revenueCorporateTaxTotal = 0;
      } else {
        this.purchaseInvoiceData.revenueCorporateTaxTotal = event.target.value;
      }
      if (this.form) {
        this.form.form.markAsDirty();
      }
    }
  }

  // Tổng thuế VAT
  public onRowEditVatTaxTotalInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.vatTaxTotal = 0;
      } else {
        this.purchaseInvoiceData.vatTaxTotal = event.target.value;
      }
      if (this.form) {
        this.form.form.markAsDirty();
      }
    }
  }

  // Tổng doanh thu có thuế VAT
  public onRowEditRevenueVatTaxTotalInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.revenueVatTaxTotal = 0;
      } else {
        this.purchaseInvoiceData.revenueVatTaxTotal = event.target.value;
      }
      if (this.form) {
        this.form.form.markAsDirty();
      }
    }
  }

  public convertCurrencyMask(price: any): string {
    if (price) {
      const stringValue = price.toString().split('.');
      const lengthOfDecimal = stringValue[1] ? stringValue[1].length : 0;
      const result = this.format(price, lengthOfDecimal, 3, ',', '.');
      return result;
    } else {
      if (price === 0) {
        return '0';
      } else {
        return '';
      }
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

  // Doanh thu chưa thuế quy đổi
  public onRowEditRevenueWithoutTaxExchange(event: any, rowData: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.revenueWithoutTaxExchange = 0;
      } else {
        rowData.revenueWithoutTaxExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }

  // Thuế TNDN quy đổi
  public onRowEditCorporateTaxExchange(event: any, rowData: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.corporateTaxExchange = 0;
      } else {
        rowData.corporateTaxExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }

  // Doanh thu có thuế TNDN quy đổi
  public onRowEditRevenueCorporateTaxExchangeInit(event: any, rowData: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.revenueCorporateTaxExchange = 0;
      } else {
        rowData.revenueCorporateTaxExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }

  // Thuế VAT quy đổi
  public onRowEditVatTaxExchange(event: any, rowData: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.vatTaxExchange = 0;
      } else {
        rowData.vatTaxExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }

  // Doanh thu có thuế VAT quy đổi
  public onRowEditRevenueVatTaxExchange(event: any, rowData: any): void {
    if (event) {
      if (event.target.value < 0) {
        rowData.revenueVatTaxExchange = 0;
      } else {
        rowData.revenueVatTaxExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }

  // Tổng doanh thu chưa thuế quy đổi
  public onRowEditRevenueWithoutTaxTotalExchangeInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.revenueWithoutTaxTotalExchange = 0;
      } else {
        this.purchaseInvoiceData.revenueWithoutTaxTotalExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }

  // Tổng thuế TNDN quy đổi
  public onRowEditCorporateTaxTotalExchangeInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.corporateTaxTotalExchange = 0;
      } else {
        this.purchaseInvoiceData.corporateTaxTotalExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }

  // Tổng doanh thu có thuế TNDN quy đổi
  public onRowEditRevenueCorporateTaxTotalExchangeInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.revenueCorporateTaxTotalExchange = 0;
      } else {
        this.purchaseInvoiceData.revenueCorporateTaxTotalExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }

  // Tổng thuế VAT quy đổi
  public onRowEditVatTaxTotalExchangeInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.vatTaxTotalExchange = 0;
      } else {
        this.purchaseInvoiceData.vatTaxTotalExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }

  // Tổng doanh thu có thuế VAT quy đổi
  public onRowEditRevenueVatTaxTotalExchangeInit(event: any): void {
    if (event) {
      if (event.target.value < 0) {
        this.purchaseInvoiceData.revenueVatTaxTotalExchange = 0;
      } else {
        this.purchaseInvoiceData.revenueVatTaxTotalExchange = event.target.value;
      }
      this.getTotalContractorTaxExchange();
      this.onRowEditInit();
    }
  }


  private getTotalContractorTaxExchange(): void {
    const conversionRate = this.exchangeRateData.conversionRate;
    if (this.dataSource && this.dataSource.treeNodes && this.dataSource.treeNodes.length > 0 && conversionRate) {
      this.treeNodeToItemSource();
      // Tính Total bảng quy đổi
      let revenueWithoutTaxExchangeTotal = 0;
      let corporateTaxExchangeTotal = 0;
      let revenueCorporateTaxExchangeTotal = 0;
      let vatTaxExchangeTotal = 0;
      let revenueVatTaxExchangeTotal = 0;
      for (const element of this.dataSource.treeNodes) {
        if (element.data) {
          const itemParent = element.data;
          // Tính Total bảng quy đổi
          revenueWithoutTaxExchangeTotal += +itemParent.revenueWithoutTaxExchange ? +itemParent.revenueWithoutTaxExchange : 0;
          corporateTaxExchangeTotal += +itemParent.corporateTaxExchange ? +itemParent.corporateTaxExchange : 0;
          revenueCorporateTaxExchangeTotal += +itemParent.revenueCorporateTaxExchange ? +itemParent.revenueCorporateTaxExchange : 0;
          vatTaxExchangeTotal += +itemParent.vatTaxExchange ? +itemParent.vatTaxExchange : 0;
          revenueVatTaxExchangeTotal += +itemParent.revenueVatTaxExchange ? +itemParent.revenueVatTaxExchange : 0;
        }
        if (element.children && element.children.length > 0) {
          for (const temp of element.children) {
            if (temp.data) {
              const itemChildrent = temp.data;
              // Tính Total bảng quy đổi
              revenueWithoutTaxExchangeTotal += +itemChildrent.revenueWithoutTaxExchange ? +itemChildrent.revenueWithoutTaxExchange : 0;
              corporateTaxExchangeTotal += +itemChildrent.corporateTaxExchange ? +itemChildrent.corporateTaxExchange : 0;
              // tslint:disable-next-line:max-line-length
              revenueCorporateTaxExchangeTotal += +itemChildrent.revenueCorporateTaxExchange ? +itemChildrent.revenueCorporateTaxExchange : 0;
              vatTaxExchangeTotal += +itemChildrent.vatTaxExchange ? +itemChildrent.vatTaxExchange : 0;
              revenueVatTaxExchangeTotal += +itemChildrent.revenueVatTaxExchange ? +itemChildrent.revenueVatTaxExchange : 0;
            }
          }
        }
      }

      // tslint:disable-next-line:max-line-length
      if (revenueWithoutTaxExchangeTotal === 0 && !this.purchaseInvoiceItems.find(x => x.revenueWithoutTaxExchange !== null && x.revenueWithoutTaxExchange !== undefined)) {
        revenueWithoutTaxExchangeTotal = null;
      }
      // tslint:disable-next-line:max-line-length
      if (corporateTaxExchangeTotal === 0 && !this.purchaseInvoiceItems.find(x => x.corporateTaxExchange !== null && x.corporateTaxExchange !== undefined)) {
        corporateTaxExchangeTotal = null;
      }
      // tslint:disable-next-line:max-line-length
      if (revenueCorporateTaxExchangeTotal === 0 && !this.purchaseInvoiceItems.find(x => x.revenueCorporateTaxExchange !== null && x.revenueCorporateTaxExchange !== undefined)) {
        revenueCorporateTaxExchangeTotal = null;
      }
      // tslint:disable-next-line:max-line-length
      if (vatTaxExchangeTotal === 0 && !this.purchaseInvoiceItems.find(x => x.vatTaxTotalExchange !== null && x.vatTaxTotalExchange !== undefined)) {
        vatTaxExchangeTotal = null;
      }
      // tslint:disable-next-line:max-line-length
      if (revenueVatTaxExchangeTotal === 0 && !this.purchaseInvoiceItems.find(x => x.revenueVatTaxExchange !== null && x.revenueVatTaxExchange !== undefined)) {
        revenueVatTaxExchangeTotal = null;

      }
      if (this.purchaseInvoiceData.currency !== 'VND') {
        // Tính Total bảng quy đổi ==> không lấy số sau dấu thập phân
        //  Giá trị = cộng line hàng đã quy đổi rồi làm tròn
        // tslint:disable-next-line:max-line-length
        this.revenueWithoutTaxExchangeTotal = revenueWithoutTaxExchangeTotal === null ? revenueWithoutTaxExchangeTotal : +revenueWithoutTaxExchangeTotal.toFixed(0);
        // tslint:disable-next-line:max-line-length
        this.corporateTaxExchangeTotal = corporateTaxExchangeTotal === null ? corporateTaxExchangeTotal : +corporateTaxExchangeTotal.toFixed(0);
        // tslint:disable-next-line:max-line-length
        this.revenueCorporateTaxExchangeTotal = revenueCorporateTaxExchangeTotal === null ? revenueCorporateTaxExchangeTotal : +revenueCorporateTaxExchangeTotal.toFixed(0);
        // tslint:disable-next-line:max-line-length
        this.vatTaxExchangeTotal = vatTaxExchangeTotal === null ? vatTaxExchangeTotal : +vatTaxExchangeTotal.toFixed(0);
        // tslint:disable-next-line:max-line-length
        this.revenueVatTaxExchangeTotal = revenueVatTaxExchangeTotal === null ? revenueVatTaxExchangeTotal : +revenueVatTaxExchangeTotal.toFixed(0);
      }
    }
  }

  public onBtnExportContractorTaxClick(): void {
    const request = new PurchaseInvoiceItemRequestPayload();
    request.piId = this.purchaseInvoiceData.id;
    const exportFileName = 'Thông tin thuế nhà thầu hóa đơn (' + this.purchaseInvoiceData.code + ')';
    this.purchaseInvoiceItemService.exportContractorTax(request, exportFileName).subscribe(() => {
      this.notificationService.showMessage('Download complete');
    });
  }

  public rounding(value: number): number {
    return (Math.round(value * 100) / 100);
  }

}
