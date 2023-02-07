import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './dialog-sync-erp-ap.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { SyncErpService } from '../../../../../../services/modules/sync-erp/sync-erp.service';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { ReceiptService } from '../../../../../../services/modules/receipt/receipt.service';
import { ReceiptRequestPayload } from '../../../../../../services/modules/receipt/receipt.request-payload';
import { SaveConfirmation } from '../../../../../../services/common/confirmation/save-confirmation';
import { ShipmentService } from '../../../../../../services/modules/shipment/shipment.service';
import { ExchangeRateRequestPayload } from '../../../../../../services/modules/category/exchange-rate/exchange-rate.request.payload';
import { ExchangeRateService } from '../../../../../../services/modules/category/exchange-rate/exchange-rate.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-sync-erp-ap',
  templateUrl: './dialog-sync-erp-ap.component.html',
  styleUrls: ['./dialog-sync-erp-ap.component.scss'],
  providers: [DatePipe]
})
export class DialogSyncErpApComponent extends BaseComponent implements OnInit {
  @Input() dialogRef: DialogRef;
  @Input() purchaseInvoiceData: any = {};
  @Output() success: EventEmitter<any> = new EventEmitter();
  public headers = [];
  public mainConfig: any;
  public request: any;
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };

  public exchangeRatePayload = new ExchangeRateRequestPayload();
  public headerExchangeRates = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.TYPE', field: 'type' },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.DATE', field: 'date', hasFormatDate: true },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.CONVERSION_RATE', field: 'conversionRate' }
  ];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private syncErpService: SyncErpService,
    private receiptService: ReceiptService,
    public shipmentService: ShipmentService,
    public exchangeRateService: ExchangeRateService,
    public purchaseInvoiceService: PurchaseInvoiceService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit() {
    this.headers = config.HEADER;

    this.request = new ReceiptRequestPayload();
    this.mainConfig = mainConfig.MAIN_CONFIG;

    this.dataSource.items = [
      {
        accountingDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        exchangeRateType: this.purchaseInvoiceData.exchangeRateType,
        exchangeRateDate: this.purchaseInvoiceData.exchangeRateDate,
        conversionRate: this.purchaseInvoiceData.conversionRate,
        exchangeRateData: {
          date: this.purchaseInvoiceData.exchangeRateDate,
          type: this.purchaseInvoiceData.exchangeRateType,
          conversionRate: this.purchaseInvoiceData.conversionRate,
          currencyFrom: this.purchaseInvoiceData.currency
        },
      }
    ];
  }

  public onBtnSaveClick(): void {
    if (!this.checkValidate()) {
      this.notification.showWarning(this.translate.instant('SYNC_ERP.VIEW_INFORMATION_SYNC_ERP'));
      return;
    }

    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      this.purchaseInvoiceData.accountingDate = this.dataSource.items[0].accountingDate;
      this.purchaseInvoiceData.exchangeRateType = this.dataSource.items[0].exchangeRateType;
      this.purchaseInvoiceData.exchangeRateDate = this.dataSource.items[0].exchangeRateDate;
      this.purchaseInvoiceData.conversionRate = this.dataSource.items[0].conversionRate;

      const requestBody: any = {
        piId: this.purchaseInvoiceData.id,
        accountingDate: this.purchaseInvoiceData.accountingDate,
        exchangeRateType: this.purchaseInvoiceData.exchangeRateType,
        exchangeRateDate: this.purchaseInvoiceData.exchangeRateDate,
        conversionRate: this.purchaseInvoiceData.conversionRate
      };
      this.syncErpService.syncPi(requestBody).subscribe(resData => {
        if (resData) {
          this.purchaseInvoiceService.selectById(this.purchaseInvoiceData.id).subscribe(pi => {
            if (pi) {
              this.purchaseInvoiceData = pi;
              this.success.emit(this.purchaseInvoiceData);
              this.dialogRef.hide();
            }
          });
        }
      });
    };
    this.notification.confirm(saveConfirmation);
  }

  public onBtnDeleteClick(): void {

  }

  public onBtnCancelClick(): void {

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

  public checkValidate(): boolean {
    if (this.dataSource.items.length === 0) {
      return false;
    }
    let checkValidate = true;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      if (!this.dataSource.items[i].accountingDate) {
        this.dataSource.items[i].isAccountingDateValid = true;
        checkValidate = false;
      } else {
        const a = _moment(new Date(this.dataSource.items[i].accountingDate), 'yyyy-MM-dd').toDate();
        const b = _moment(new Date(), 'yyyy-MM-dd').toDate();
        if (this.compareDate(a, b) === 1) {
          this.dataSource.items[i].isAccountingDateValid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isAccountingDateValid = false;
        }
      }
      if (this.purchaseInvoiceData.currency === 'VND') {
        this.dataSource.items[i].isConversionRateValid = false;
        this.dataSource.items[i].isExchangeRateTypeValid = false;
      } else {
        if (!this.dataSource.items[i].exchangeRateType) {
          this.dataSource.items[i].isExchangeRateTypeValid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isExchangeRateTypeValid = false;
        }
        if (!this.dataSource.items[i].conversionRate) {
          this.dataSource.items[i].isConversionRateValid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isConversionRateValid = false;
        }
      }
    }
    return checkValidate;
  }

  public onChangeExchangeRate(exchangeRateDto: any, rowData: any): void {
    if (exchangeRateDto) {
      rowData.exchangeRateType = exchangeRateDto.type;
      rowData.exchangeRateDate = exchangeRateDto.date;
      rowData.conversionRate = exchangeRateDto.conversionRate;
    }
  }

}
