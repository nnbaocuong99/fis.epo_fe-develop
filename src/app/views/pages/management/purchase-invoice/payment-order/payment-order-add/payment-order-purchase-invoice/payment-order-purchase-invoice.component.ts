import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../../../../services/common/notification/notification.service';
import { CurrencyService } from '../../../../../../../services/modules/category/currency/currency.service';
import { InvoiceTypeService } from '../../../../../../../services/modules/category/invoice-type/invoice-type.service';
import { ItemService } from '../../../../../../../services/modules/category/item/item.service';
import { SupplierService } from '../../../../../../../services/modules/category/supplier/supplier.service';
import { PurchaseInvoiceRequestPayload } from '../../../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { PurchaseInvoiceService } from '../../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { UserService } from '../../../../../../../services/modules/user/user.service';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './payment-order-purchase-invoice.config';
import * as mainConfig from '../../../../../../../core/_config/main.config';
import { BaseListComponent } from '../../../../../../../core/_base/component';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigListRequestPayload } from '../../../../../../../services/modules/config-list/config-list.request.payload';
import {
  OperatingUnitService
} from '../../../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { ConfigListService } from '../../../../../../../services/modules/config-list/config-list.service';
import { DepartmentService } from '../../../../../../../services/modules/category/department/department.service';
import { PurchaseOrderService } from '../../../../../../../services/modules/purchase-order/purchase-order.service';

@Component({
  selector: 'app-payment-order-purchase-invoice',
  templateUrl: './payment-order-purchase-invoice.component.html',
  styleUrls: ['./payment-order-purchase-invoice.component.scss']
})
export class PaymentOrderPurchaseInvoiceComponent extends BaseListComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();

  public selectedPurchaseInvoice = [];
  public selectedPurchaseInvoiceTemp = [];
  public listFisX = [];
  public arrCostTypes = [];
  public statusInvoices = config.STATUS_INVOICE;
  public statusErps = config.STATUS_ERP;
  public statusTaxs = config.STATUS_TAX;
  public itemTypes = config.ITEMS_TYPES;
  public headerOperatingUnit = config.HEADER_OPERATING_UNIT;

  constructor(
    public purchaseInvoiceService: PurchaseInvoiceService,
    public operatingUnitService: OperatingUnitService,
    public purchaseOrderService: PurchaseOrderService,
    public departmentService: DepartmentService,
    private configListService: ConfigListService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    public invoiceTypeService: InvoiceTypeService,
    public userService: UserService,
    public supplierService: SupplierService,
    public currencyService: CurrencyService,
    public itemService: ItemService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.request = new PurchaseInvoiceRequestPayload();
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.baseService = this.purchaseInvoiceService;
    this.headers = config.HEADERS;
    this.getConfigData();
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        // Không lấy bản ghi hoá đơn hiện tại
        // this.request.idHide = params.id;
      }
      this.initData();
      this.pagingData();
    });
    this.subscriptions.push(routeSub);

  }

  public getConfigData(): void {
    // Get tên loại chi phí
    const requestConfigList = new ConfigListRequestPayload();
    requestConfigList.type = 'COST_TYPE';
    const temp = forkJoin([
      this.configListService.select(requestConfigList),
      this.departmentService.select()
    ]).subscribe(res => {
      this.arrCostTypes = res[0];
      if (res[1] && res[1].length > 0) {
        const listtem = Object.keys(this.groupBy(res[1].filter(x => x.acronym), 'acronym'));
        for (const fisX of listtem) {
          this.listFisX.push({ label: fisX });
        }
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(temp);
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }

    const requests = [
      this.purchaseInvoiceService.selectWithoutPaymentOrder(this.request),
      this.purchaseInvoiceService.countWithoutPaymentOrder(this.request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.dataSource.paginatorTotal = response[1];
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
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

  public onBtnSaveClick(): void {
    if (this.selectedPurchaseInvoice && this.selectedPurchaseInvoice.length > 0) {
      this.save.emit(this.selectedPurchaseInvoice);
      this.dialogRef.hide();
      this.cdr.detectChanges();
    }
  }

  public onBtnCancelClick(): void {
    this.success.emit();
  }

  public onBtnSearchClick(): void {
    this.initData();
  }

  public onBtnResetSearchClick() {
    this.request = new PurchaseInvoiceRequestPayload();
  }

  public onSelectCheckbox(event: any, type: number): void {
    if (type === 1) {
      // On select
      const list = this.selectedPurchaseInvoice.filter(x => x.vendorId !== event.data.vendorId);
      if (list.length > 0) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp');
        const index = this.selectedPurchaseInvoice.findIndex(x => x.id === event.data.id);
        if (index > -1) {
          this.selectedPurchaseInvoice.splice(index, 1);
        }
      }

      setTimeout(() => {
        this.selectedPurchaseInvoice = [...this.selectedPurchaseInvoice];
        this.cdr.detectChanges();
      }, 0);
    } else if (type === 0) {
      // On unselect

    }
  }

  public onChangeLegal(event: any): void {
    if (event) {
      this.request.ouCode = event.ouId;
    }
  }

  public groupBy(xs: any[], key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

}
