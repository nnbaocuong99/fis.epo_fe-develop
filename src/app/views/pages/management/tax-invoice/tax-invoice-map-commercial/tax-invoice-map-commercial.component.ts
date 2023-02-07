import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './tax-invoice-map-commercial.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { forkJoin, merge } from 'rxjs';
import {
  PurchaseInvoicePaymentRequestPayload
} from '../../../../../services/modules/purchase-invoice-payment/purchase-invoice-payment.request-payload';
import { MatPaginator } from '@angular/material';
import { TaxInvoiceService } from '../../../../../services/modules/tax-invoice/tax-invoice.service';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { tap } from 'rxjs/internal/operators/tap';
import { PurchaseInvoiceService } from '../../../../../services/modules/purchase-invoice/purchase-invoice.service';
@Component({
  selector: 'app-tax-invoice-map-commercial',
  templateUrl: './tax-invoice-map-commercial.component.html',
  styleUrls: ['./tax-invoice-map-commercial.component.scss']
})
export class TaxInvoiceMapCommercialComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Output() success: EventEmitter<any> = new EventEmitter();

  public priorityMapConfig = config.PRIORITY_MAP;
  public statusTaxInvoice = config.STATUS_TAX_INVOICE;
  public headerTable = config.HEADER_TAX_INVOICE;
  public headerTablePurchase = config.HEADER_PURCHASE_INVOICE_PAYMENT;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public isHideTaxInvoice = false;
  public isHideCom = false;
  public listPiMapSelect: any[] = [];

  public request: PurchaseInvoicePaymentRequestPayload;
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };

  public requestMap: any = {
    comIds: [],
    taxInvoiceId: null,
  };

  constructor(
    public purchaseInvoiceService: PurchaseInvoiceService,
    public taxInvoiceService: TaxInvoiceService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.initData(1);
    this.pagingData();
  }

  public initData(requestMap?: number): void {
    if (requestMap) {
      this.updateRequest(requestMap);
      if (requestMap === 4 && !this.dialogRef.input.rowData.poCode) {
        this.notificationService.showWarning('Vui lòng update thông tin số PO trên TaxInvoice để Map TAX-COM theo số PO');
        return;
      }
    }
    this.listPiMapSelect = [];
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.purchaseInvoiceService.selectWithMapPi(this.request),
      this.purchaseInvoiceService.countWithMapPi(this.request),
    ];
    const purchaseRequestSub = forkJoin(requests).subscribe(
      (response: any[]) => {
        if (response[0]) {
          this.dataSource.items = response[0];
          this.dataSource.items.map(x => {
            this.getDuedateAndDueWeek(x);
            return x;
          });
          this.dataSource.paginatorTotal = response[1];
          // default checked khi map số tax-com (chỉ có 1 bản ghi thỏa mãn khi map)
          if (this.request.code !== null && this.dataSource.items.length > 0) {
            this.listPiMapSelect.push(this.dataSource.items[0]);
            this.dataSource.items[0].checked = true;
          }
        }
        this.cdr.detectChanges();
      });
    this.subscriptions.push(purchaseRequestSub);
  }

  public pagingData(): void {
    if (this.paginator) {
      const paginatorSubscriptions = merge(this.paginator.page).pipe(
        tap(() => {
          this.initData();
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }

  public updateRequest(priority: number): void {
    if (this.dialogRef.input.rowData) {
      this.request = new PurchaseInvoicePaymentRequestPayload();
      switch (priority) {
        case 2: // Theo giá trị hóa đơn
          // tslint:disable-next-line:max-line-length
          this.request.mapAmountInvoice = true;
          this.request.amount = this.dialogRef.input.rowData.value ? this.dialogRef.input.rowData.value : 0; // Map theo giá trị hóa đơn
          // tslint:disable-next-line:max-line-length
          this.request.vendorId = this.dialogRef.input.rowData.vendorId ? this.dialogRef.input.rowData.vendorId : null; // Cùng nhà NCC
          break;
        case 3: // Theo giá trị PO
          // tslint:disable-next-line:max-line-length
          this.request.amount = this.dialogRef.input.rowData.value ? this.dialogRef.input.rowData.value : 0; // Map theo giá trị PO
          // tslint:disable-next-line:max-line-length
          this.request.vendorId = this.dialogRef.input.rowData.vendorId ? this.dialogRef.input.rowData.vendorId : null; // Cùng nhà NCC
          break;
        case 4: // Theo số PO
          // tslint:disable-next-line:max-line-length
          this.request.poCode = this.dialogRef.input.rowData.poCode ? this.dialogRef.input.rowData.poCode : null; // Map theo số PO
          // tslint:disable-next-line:max-line-length
          this.request.vendorId = this.dialogRef.input.rowData.vendorId ? this.dialogRef.input.rowData.vendorId : null; // Cùng nhà NCC
          break;
        case 5: // Theo NCC
          // tslint:disable-next-line:max-line-length
          this.request.vendorId = this.dialogRef.input.rowData.vendorId ? this.dialogRef.input.rowData.vendorId : null; // Map theo nhà cung cấp
          break;
        default:
          // tslint:disable-next-line:max-line-length
          this.request.code = this.dialogRef.input.rowData.code ? this.dialogRef.input.rowData.code : null; // mặc định tìm/map theo số Tax-Com
          // tslint:disable-next-line:max-line-length
          this.request.vendorId = this.dialogRef.input.rowData.vendorId ? this.dialogRef.input.rowData.vendorId : null; // Cùng nhà NCC
          break;
      }
    }
  }

  public getDuedateAndDueWeek(items: any): void {
    if (items.paymentTerm && items.date) {
      const paymentTermTemp = Number(items.paymentTerm.slice(0, -1));
      const temp = new Date(items.date);
      const dateTemp = new Date(temp.setDate(temp.getDate() + paymentTermTemp));
      // get date
      items.dueDate = dateTemp;
      // get week
      const onejan = new Date(dateTemp.getFullYear(), 0, 1);
      const millisecsInDay = 86400000;
      const week = Math.ceil((((dateTemp.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay() + 1) / 7);
      items.dueWeek = week;
    }
  }

  public onBtnSaveClick(): void {
    if (this.listPiMapSelect.length === 0) {
      return this.notificationService.showWarning('Chưa có COM nào được chọn!');
    }
    let totalMap = 0;
    let currency = null;
    // tslint:disable-next-line:no-shadowed-variable
    for (const element of this.listPiMapSelect) {
      totalMap += element.amount ? +element.amount : 0;
      currency = currency ? currency : element.currency;
    }

    if (this.dialogRef.input.rowData.currency !== currency) {
      return this.notificationService.showWarning('Loại tiền Tax Invoice - Commercial Invoice khác nhau!');
    }

    if (this.dialogRef.input.rowData.value !== totalMap) {
      return this.notificationService.showWarning('Số tiền map Tax Invoice - Commercial Invoice không bằng nhau!');
    }
    this.requestMap.comIds = this.listPiMapSelect.map(a => a.id);
    this.requestMap.taxInvoiceId = this.dialogRef.input.rowData.id;
    this.taxInvoiceService.bulkMap(this.requestMap).subscribe((res) => {
      if (res) {
        this.notificationService.showSuccess();
        this.listPiMapSelect = [];
        this.success.emit();
        this.dialogRef.hide();
      } else {
        this.notificationService.showError();
      }
    });
  }

  public onBtnCancelClick(): void {

  }

  public onSelectCom(rowData: any, event: any): void {
    rowData.checked = event.checked;
    if (event.checked) {
      this.listPiMapSelect.push(rowData);
    } else {
      const index = this.listPiMapSelect.indexOf(rowData, 0);
      if (index > -1) {
        this.listPiMapSelect.splice(index, 1);
      }
    }
  }

}
