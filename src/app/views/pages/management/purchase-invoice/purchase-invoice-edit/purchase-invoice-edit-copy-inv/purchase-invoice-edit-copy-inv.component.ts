import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseListComponent } from '../../../../../../core/_base/component/base-list.component';
import { PurchaseInvoiceRequestPayload } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-invoice-edit-copy-inv.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { ActivatedRoute } from '@angular/router';
import {
  PurchaseInvoiceItemRequestPayload
} from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.request-payload';
import { PurchaseInvoiceItemService } from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { InvoiceTypeService } from '../../../../../../services/modules/category/invoice-type/invoice-type.service';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';
import { ItemService } from '../../../../../../services/modules/category/item/item.service';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';

@Component({
  selector: 'app-purchase-invoice-edit-copy-inv',
  templateUrl: './purchase-invoice-edit-copy-inv.component.html',
  styleUrls: ['./purchase-invoice-edit-copy-inv.component.scss']
})
export class PurchaseInvoiceEditCopyInvComponent extends BaseListComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();
  public selectedPurchaseInvoice: any = {};
  public arrCostTypes = [];
  public statusInvoices = config.STATUS_INVOICE;
  public statusErps = config.STATUS_ERP;
  public statusTaxs = config.STATUS_TAX;
  public itemTypes = config.ITEMS_TYPES;

  constructor(
    public purchaseInvoiceService: PurchaseInvoiceService,
    private purchaseInvoiceItemService: PurchaseInvoiceItemService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public invoiceTypeService: InvoiceTypeService,
    public userService: UserService,
    public supplierService: SupplierService,
    public currencyService: CurrencyService,
    public itemService: ItemService
  ) {
    super();
    this.request = new PurchaseInvoiceRequestPayload();
  }

  ngOnInit() {
    this.baseService = this.purchaseInvoiceService;
    this.headers = config.HEADERS;
    // Không lấy bản ghi loại chi phí là giá hàng hóa dịch vụ
    this.request.filterCostType = 'Giá hàng hóa/dịch vụ';
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        // Không lấy bản ghi hoá đơn hiện tại
        this.request.idHide = params.id;
      }
    });
    this.subscriptions.push(routeSub);
    this.mainConfig = mainConfig.MAIN_CONFIG;
    super.ngOnInit();
    this.arrCostTypes = ConfigListFactory.instant('COST_TYPE');
  }

  public onBtnSaveClick(): void {
    if (this.selectedPurchaseInvoice.id) {
      this.save.emit(this.selectedPurchaseInvoice);
      this.dialogRef.hide();
      this.cdr.detectChanges();
    }
  }

  public onBtnCancelClick(): void {
    this.success.emit();
  }

  public onBtnLoadNodeSearchClick(): void {
    this.initData();
  }

  public onBtnResetSearchClick() {
    this.request = new PurchaseInvoiceRequestPayload();
  }

  public onChangeCheckbox(event): void {
    const query = new PurchaseInvoiceItemRequestPayload();
    query.piId = this.dialogRef.input.id;
    query.piIds = [event.data.id];

    this.purchaseInvoiceItemService.checkExists(query).subscribe(m => {
      if (m) {
        this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_005');
        this.cdr.detectChanges();
      }
    });
  }

  public onChangeItemCode(data: any): void {
    if (data) {
      this.request.itemCode = data.code;
      this.request.itemName = data.name;
    } else {
      this.request.itemCode = null;
      this.request.itemName = null;
    }
  }

}
