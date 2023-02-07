import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './receipt-step1.config';
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
import * as _moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-receipt-step1',
  templateUrl: './receipt-step1.component.html',
  styleUrls: ['./receipt-step1.component.scss']
})
export class ReceiptStep1Component extends BaseComponent implements OnInit {
  @Input() dialogRef: DialogRef;
  @Output() success: EventEmitter<any> = new EventEmitter();
  public headers = [];
  public mainConfig: any;
  public request: any;
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public shipmentData: any = {};
  public id: string;

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
    public exchangeRateService: ExchangeRateService
  ) {
    super();
  }

  ngOnInit() {
    this.headers = config.HEADER;
    this.dialogRef.input.rowData = {};

    this.request = new ReceiptRequestPayload();
    this.mainConfig = mainConfig.MAIN_CONFIG;

    this.dataSource.items = [];
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.shipmentService.selectById(params.id).subscribe(res => {
          this.shipmentData = res;
          this.request.shipmentId = params.id;
          this.receiptService.select(this.request).subscribe(res => {
            this.dataSource.items = res.map(x => {
              x.exchangeRateData = { currencyFrom: this.shipmentData.currency };
              return x;
            });
            this.cdr.detectChanges();
          });
        });
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onRowEditReceiptNumberDomain(rowData: any) {
    if (rowData) {
      rowData.receiptNumber = rowData.receiptNumberDomain + '' + rowData.receiptNumberIndexNo;
    }
  }

  public onBtnSaveClick(): void {
    if (!this.checkValidate()) {
      this.notification.showWarning(this.translate.instant('SYNC_ERP.VIEW_INFORMATION_SYNC_ERP'));
      return;
    }

    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      const listReceipt = this.dataSource.items.map(x => {
        delete x.id;
        x.shipmentId = this.id;
        x.step = 1;
        return x;
      });
      const dataSave: any = {
        shipmentId: this.id,
        listReceipt
      };
      // đẩy bảng EPO_PO_HEADER_IN và EPO_PO_LINE_IN
      this.syncErpService.syncReceiptStep1Shipment(dataSave).subscribe(res => {
        if (res && res.length > 0) {
          this.shipmentService.selectById(this.id).subscribe(shipment => {
            if (shipment) {
              this.notification.showSuccess();
              this.dialogRef.hide();
              this.success.emit(true);
            }
          });
        } else {
          this.notification.showWarning('Dữ liệu đã tồn tại, xin kiểm tra lại');
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
      if (!this.dataSource.items[i].poDescriptionStep1) {
        this.dataSource.items[i].isPoDescriptionStep1Valid = true;
        checkValidate = false;
      } else {
        this.dataSource.items[i].isPoDescriptionStep1Valid = false;
      }
      if (!this.dataSource.items[i].receiptDateStep1) {
        this.dataSource.items[i].isReceiptDateStep1Valid = true;
        checkValidate = false;
      } else {
        const a = _moment(new Date(this.dataSource.items[i].receiptDateStep1), 'yyyy-MM-dd').toDate();
        const b = _moment(new Date(), 'yyyy-MM-dd').toDate();
        if (this.compareDate(a, b) === 1) {
          this.dataSource.items[i].isReceiptDateStep1Valid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isReceiptDateStep1Valid = false;
        }
      }
      if (this.shipmentData.currency === 'VND') {
        this.dataSource.items[i].isExchangeRateValid = false;
        this.dataSource.items[i].isExchangeRateValueValid = false;
      } else {
        if (!this.dataSource.items[i].exchangeRate) {
          this.dataSource.items[i].isExchangeRateValid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isExchangeRateValid = false;
        }
        if (!this.dataSource.items[i].exchangeRateValue) {
          this.dataSource.items[i].isExchangeRateValueValid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isExchangeRateValueValid = false;
        }
      }
      if (!this.dataSource.items[i].receiptNumberDomain) {
        this.dataSource.items[i].isReceiptNumberDomainValid = true;
        checkValidate = false;
      } else {
        this.dataSource.items[i].isReceiptNumberDomainValid = false;
      }

      if (this.dataSource.items[i].receiptDateStep1 && this.dataSource.items[i].exchangeRateDate) {
        const a = _moment(new Date(this.dataSource.items[i].receiptDateStep1.toString()), 'yyyy-MM-dd').toDate();
        const b = _moment(new Date(this.dataSource.items[i].exchangeRateDate.toString()), 'yyyy-MM-dd').toDate();
        if (this.compareDate(a, b) !== 0) {
          this.notification.showWarning(`${this.dataSource.items[i].poCodePushErp}: Ngày receipt và ngày tỷ giá không giống nhau`);
        }
      }
    }
    return checkValidate;
  }

  public onChangeReceiptDate(data, index): void {
    if (index === 0) {
      this.dataSource.items.map(x => {
        x.receiptDateStep1 = data;
        return x;
      });
    }
  }

  public onChangeExchangeRate(exchangeRateDto: any, rowData: any): void {
    if (exchangeRateDto) {
      this.dataSource.items.map(x => {
        x.exchangeRate = exchangeRateDto.type;
        x.exchangeRateDate = exchangeRateDto.date;
        x.exchangeRateValue = exchangeRateDto.conversionRate;
        x.exchangeRateData = {
          date: exchangeRateDto.date,
          type: exchangeRateDto.type,
          conversionRate: exchangeRateDto.conversionRate,
          currencyFrom: this.shipmentData.currency
        };
        return x;
      });
      this.checkValidate();
    }
  }

}
