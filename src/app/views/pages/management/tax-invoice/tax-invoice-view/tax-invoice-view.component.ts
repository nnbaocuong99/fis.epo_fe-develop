import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from '../tax-invoice.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { TaxInvoiceService } from '../../../../../services/modules/tax-invoice/tax-invoice.service';
import { FileService } from '../../../../../services/modules/file/file.service';
import { FileRequestPayload } from '../../../../../services/modules/file/file.request.payload';
import { forkJoin } from 'rxjs';
import { FileDownload } from '../../../../partials/control/download-file/download-file.component';
import { PurchaseInvoicePaymentService } from '../../../../../services/modules/purchase-invoice-payment/purchase-invoice-payment.service';
import { PurchaseInvoiceService } from '../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoiceRequestPayload } from '../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';

@Component({
  selector: 'app-tax-invoice-view',
  templateUrl: './tax-invoice-view.component.html',
  styleUrls: ['./tax-invoice-view.component.scss']
})
export class TaxInvoiceViewComponent extends BaseFormComponent implements OnInit {
  @Input() dialogRef: DialogRef;

  public statusTaxInvoice = config.STATUS_TAX_INVOICE;
  public headerCommercialInvoice = config.HEADER_COMMERCIAL_INVOICE;
  public mainConfig: any;
  public taxInvoiceData: any;
  public commercialInvoiceData: any;
  public isHideTaxInvoice = false;
  public isHideCom = false;

  constructor(
    private fileService: FileService,
    public purchaseInvoicePaymentService: PurchaseInvoicePaymentService,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private taxInvoiceService: TaxInvoiceService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;
  }

  public onDialogShow(): void {
    this.initData();
  }

  public onDlgHide(): void {
    this.dialogRef.invisible();
  }

  /**
   * Initialize data
   */
  private initData(): void {
    // Get purchase invoices id from input dialog ref
    this.dialogRef.hideMask();
    const taxInvoiceId = this.dialogRef.input.rowData.id;

    const request = new FileRequestPayload();
    request.module = 'Attachment\\TaxInvoice\\' + this.dialogRef.input.rowData.id;

    const requestcommercialInvoice = new PurchaseInvoiceRequestPayload();
    requestcommercialInvoice.tiId = this.dialogRef.input.rowData.id;

    requestcommercialInvoice.pageIndex = 0;
    requestcommercialInvoice.pageSize = 10;
    const categorySub = forkJoin([
      // Get purchase invoice
      this.taxInvoiceService.selectById(taxInvoiceId),
      // Get purchase invoice item
      this.fileService.select(request),
      this.purchaseInvoiceService.selectWithMapPi(requestcommercialInvoice),
    ]).subscribe((res) => {
      if (!!res[0]) { // When response is not null, load data
        this.taxInvoiceData = res[0];
        this.cdr.detectChanges(); // Detect changes on screen
      } else {
        this.taxInvoiceData = {};
      }
      if (res[1] && res[1].length > 0) {
        this.taxInvoiceData.fileInfo = res[1][0];
        this.taxInvoiceData.fileName = this.taxInvoiceData.fileInfo.name;
      }
      if (res[2] && res[2].length > 0) {
        this.commercialInvoiceData = res[2];
        this.commercialInvoiceData.map(x => {
          this.getDuedateAndDueWeek(x);
          return x;
        });
      }
      this.dialogRef.visible();
      this.dialogRef.showMask();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
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

  public onBtnDownloadClick(): void {
    const fileInfo = this.taxInvoiceData.fileInfo;
    if (fileInfo) {
      const fileDownload = new FileDownload();
      fileDownload.id = fileInfo.id;
      fileDownload.name = fileInfo.name;
      this.fileService.download(fileDownload);
    }
  }

}

