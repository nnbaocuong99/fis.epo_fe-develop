import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { ExchangeRateService } from '../../../../../services/modules/category/exchange-rate/exchange-rate.service';
import { ReceiptRequestPayload } from '../../../../../services/modules/receipt/receipt.request-payload';
import { ReceiptService } from '../../../../../services/modules/receipt/receipt.service';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';
import { SyncErpService } from '../../../../../services/modules/sync-erp/sync-erp.service';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './dialog-import-sync-erp.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { ExchangeRateRequestPayload } from '../../../../../services/modules/category/exchange-rate/exchange-rate.request.payload';
import { PurchaseOrderItemService } from '../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { AppState } from '../../../../../core/reducers';
import { select, Store } from '@ngrx/store';
import { currentUser } from '../../../../../core/auth';
import * as _moment from 'moment';
import { forkJoin } from 'rxjs';
import { NotificationListService } from '../../../../../services/modules/notification-list/notification-list.service';

@Component({
  selector: 'app-dialog-import-sync-erp',
  templateUrl: './dialog-import-sync-erp.component.html',
  styleUrls: ['./dialog-import-sync-erp.component.scss']
})
export class DialogImportSyncErpComponent extends BaseComponent implements OnInit {
  @Input() dialogRef: DialogRef;
  @Input() type: string;
  @Input() currency: string;
  @Input() dataModel: any;
  @Output() success: EventEmitter<any> = new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();
  public headers: any = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request: any;
  public dataSource = {
    items: [],
    paginatorTotal: null,
    listReceiptUpdateReciptB2Erp: null
  };
  public currentId: string;
  public currentUser: any = {};
  public showViewInfoSyncErp = false;
  public receiptStep2Data = {
    items: [],
    paginatorTotal: null,
  };
  public notificationData: any = {};
  public exchangeRatePayload = new ExchangeRateRequestPayload();
  public headerExchangeRates = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.TYPE', field: 'type' },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.DATE', field: 'date', hasFormatDate: true },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.CONVERSION_RATE', field: 'conversionRate' }
  ];

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private syncErpService: SyncErpService,
    private receiptService: ReceiptService,
    public shipmentService: ShipmentService,
    public exchangeRateService: ExchangeRateService,
    public purchaseOrderItemService: PurchaseOrderItemService,
    public notificationListService: NotificationListService,
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

  }

  public initData(): void {
    this.request = new ReceiptRequestPayload();
    this.dataSource.items = [];

    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.currentId = params.id;
        if (this.type === 'shipment') {
          this.request.shipmentId = params.id;
          this.receiptService.selectReceiptStep2SI(this.request).subscribe(res => {
            if (res && res.ListReceipt.length > 0) {
              this.dataSource.items = res.ListReceipt.map(x => {
                x.ExchangeRateData = { currencyFrom: this.currency };
                return x;
              });
              this.dataSource.listReceiptUpdateReciptB2Erp = res.ListReceiptUpdateErp;
              this.cdr.detectChanges();
            }
          });
        }
        if (this.type === 'invoice') {
          this.request.piId = params.id;
          this.receiptService.selectReceiptStep2PI(this.request).subscribe(res => {
            if (res && res.length > 0) {
              this.dataSource.items = res.map(x => {
                x.ExchangeRateData = { currencyFrom: this.currency };
                return x;
              });
              this.cdr.detectChanges();
            }
          });
        }
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onViewDialogSyncErp(): void {
    // Check show dưới form view
    if (this.dialogRef.input.viewInfoSyncErp) {
      this.showViewInfoSyncErp = this.dialogRef.input.viewInfoSyncErp;
      const receiptStep2Request = new ReceiptRequestPayload();
      const routeSub = this.route.params.subscribe(params => {
        if (params.id) {
          if (this.type === 'shipment') {
            receiptStep2Request.shipmentId = params.id;
          }
          if (this.type === 'invoice') {
            receiptStep2Request.piId = params.id;
          }
          const initSub = forkJoin([
            this.receiptService.selectViewData(receiptStep2Request),
            this.receiptService.countViewData(receiptStep2Request)
          ]).subscribe(res => {
            this.receiptStep2Data = {
              items: res[0],
              paginatorTotal: res[1],
            };
            this.cdr.detectChanges();
          });
          this.subscriptions.push(initSub);
        }
      });
      this.subscriptions.push(routeSub);
    }
  }

  public onBtnSaveClick(): void {
    if (!this.checkValidate()) {
      this.notification.showWarning('Vui lòng nhập!');
      return;
    }

    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      if (this.type === 'shipment') {
        this.syncReceiptStep2Shipment();
        this.defaultInfoSaveNotification('shipment');
      }
      if (this.type === 'invoice') {
        this.syncReceiptStep2Invoice();
        this.defaultInfoSaveNotification('invoice');
      }
    };
    this.notification.confirm(saveConfirmation);
  }

  public defaultInfoSaveNotification(type: string): void {
    this.notificationData.status = 1;
    this.notificationData.module = 'import-goods-' + type;

    if (type === 'shipment') {
      this.notificationData.description = 'Import-goods:  Nhập hàng cho lô hàng ERP';
      const importGoods = { id: this.currentId, code: this.dataModel ? this.dataModel.code : '' };
      this.notificationData.messageContent = JSON.stringify(importGoods);
    } else {
      this.notificationData.description = 'Import-goods:  Nhập hàng cho hóa đơn ERP';
      const importGoods = { id: this.currentId, code: this.dataModel ? this.dataModel.code : '' };
      this.notificationData.messageContent = JSON.stringify(importGoods);
    }

    // Thông báo đến BP
    const roleBp = 'BP_STAFF;BP_MANAGER';
    this.notificationData.role = roleBp;

    const saveSub = this.notificationListService.merge(this.notificationData).subscribe(() => { });
    this.subscriptions.push(saveSub);
  }

  private syncReceiptStep2Shipment(): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      this.dataSource.listReceiptUpdateReciptB2Erp[i].RCV2_RECEIPT_DATE = this.dataSource.items[i].ReceiptDateStep2;
      this.dataSource.listReceiptUpdateReciptB2Erp[i].RCV2_COMMENTS = this.dataSource.items[i].PoDescriptionStep2;
    }
    // cập nhật lại bảng EPO_PO_HEADER_IN và EPO_PO_LINE_IN
    const data: any = {
      listReceiptUpdateErp: this.dataSource.listReceiptUpdateReciptB2Erp,
      listReceipt: this.dataSource.items
    };
    this.syncErpService.syncReceiptStep2Shipment(data).subscribe(resp => {
      if (resp) {
        this.success.emit(this.currentUser.id);
        this.dialogRef.hide();
        this.cdr.detectChanges();
      } else {
        this.error.emit(this.currentUser.id);
      }
    });
  }

  private syncReceiptStep2Invoice(): void {
    const listReceipt = this.dataSource.items.map(x => {
      delete x.id;
      x.piId = this.currentId;
      x.step = 2;
      return x;
    });
    const dataSave: any = {
      piId: this.currentId,
      listReceipt
    };
    // đẩy bảng EPO_PO_HEADER_IN và EPO_PO_LINE_IN
    this.syncErpService.syncReceiptStep2Invoice(dataSave).subscribe(res => {
      if (res && res.length > 0) {
        this.success.emit(this.currentUser.id);
        this.dialogRef.hide();
        this.cdr.detectChanges();
      } else {
        this.error.emit(this.currentUser.id);
        this.notification.showWarning('Dữ liệu đã tồn tại, xin kiểm tra lại');
      }
    });
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
      if (!this.dataSource.items[i].PoDescriptionStep2) {
        this.dataSource.items[i].isPoDescriptionStep2Valid = true;
        checkValidate = false;
      } else {
        this.dataSource.items[i].isPoDescriptionStep2Valid = false;
      }
      if (!this.dataSource.items[i].ReceiptDateStep2) {
        this.dataSource.items[i].isReceiptDateStep2Valid = true;
        checkValidate = false;
      } else {
        const a = _moment(new Date(this.dataSource.items[i].ReceiptDateStep2), 'yyyy-MM-dd').toDate();
        const b = _moment(new Date(), 'yyyy-MM-dd').toDate();
        if (this.compareDate(a, b) === 1) {
          this.dataSource.items[i].isReceiptDateStep1Valid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isReceiptDateStep1Valid = false;
        }
      }
      if (this.currency === 'VND') {
        this.dataSource.items[i].isExchangeRateValid = false;
        this.dataSource.items[i].isExchangeRateValueValid = false;
      } else {
        if (!this.dataSource.items[i].ExchangeRate) {
          this.dataSource.items[i].isExchangeRateValid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isExchangeRateValid = false;
        }
        if (!this.dataSource.items[i].ExchangeRateValue) {
          this.dataSource.items[i].isExchangeRateValueValid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isExchangeRateValueValid = false;
        }
      }
      if (this.type === 'invoice') {
        if (!this.dataSource.items[i].ReceiptNumberDomain) {
          this.dataSource.items[i].isReceiptNumberDomainValid = true;
          checkValidate = false;
        } else {
          this.dataSource.items[i].isReceiptNumberDomainValid = false;
        }
      }

      if (this.dataSource.items[i].ReceiptDateStep2 && this.dataSource.items[i].ExchangeRateDate) {
        const a = _moment(new Date(this.dataSource.items[i].ReceiptDateStep2.toString()), 'yyyy-MM-dd').toDate();
        const b = _moment(new Date(this.dataSource.items[i].ExchangeRateDate.toString()), 'yyyy-MM-dd').toDate();
        if (this.compareDate(a, b) !== 0) {
          this.notification.showWarning(`${this.dataSource.items[i].PoCodePushErp}: Ngày receipt và ngày tỷ giá không giống nhau`);
        }
      }

    }
    return checkValidate;
  }

  public onChangeReceiptDate(data, index): void {
    if (index === 0) {
      this.dataSource.items.map(x => {
        x.ReceiptDateStep2 = data;
        return x;
      });
    }
  }

  public onChangeExchangeRate(exchangeRateDto: any, rowData: any): void {
    if (exchangeRateDto) {
      this.dataSource.items.map(x => {
        x.ExchangeRate = exchangeRateDto.type;
        x.ExchangeRateDate = exchangeRateDto.date;
        x.ExchangeRateValue = exchangeRateDto.conversionRate;
        x.ExchangeRateData = {
          date: exchangeRateDto.date,
          type: exchangeRateDto.type,
          conversionRate: exchangeRateDto.conversionRate,
          currencyFrom: this.currency
        };
        return x;
      });
    }
  }

  public onRowEditReceiptNumberDomain(rowData: any) {
    if (rowData) {
      rowData.ReceiptNumber = rowData.ReceiptNumberDomain + '' + rowData.ReceiptNumberIndexNo;
    }
  }
}
