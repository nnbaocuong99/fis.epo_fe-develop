import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { TaxInvoiceService } from '../../../../../services/modules/tax-invoice/tax-invoice.service';
import { UserRequestPayload } from '../../../../../services/modules/user/user-request.payload';
import { UserService } from '../../../../../services/modules/user/user.service';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import * as config from './tax-invoice-edit.config';
import { take } from 'rxjs/operators';
import { currentUser } from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { Store } from '@ngrx/store';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';
import { PurchaseOrderRequestPayload } from '../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { Guid } from 'guid-typescript';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { TaxInvoiceRequestPayload } from '../../../../../services/modules/tax-invoice/tax-invoice.request-payload';
import { Location } from '@angular/common';
@Component({
  selector: 'app-tax-invoice-edit',
  templateUrl: './tax-invoice-edit.component.html',
  styleUrls: ['./tax-invoice-edit.component.scss']
})
export class TaxInvoiceEditComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  public formData: FormDynamicData = new FormDynamicData();
  public userRequestPayLoad = new UserRequestPayload();
  public taxInvoiceData: any = {};
  public statusTaxInvoice = config.STATUS_TAX_INVOICE;
  public headerUser = config.HEADER_USER;
  public headerPo = config.HEADER_PO;
  public currentTaxInvoiceId: string;
  public purchaseOrderRequestPayload = new PurchaseOrderRequestPayload();
  public exchangeRateData: any = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private taxInvoiceService: TaxInvoiceService,
    public userService: UserService,
    public supplierService: SupplierService,
    public purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private notificationService: NotificationService,
    public currencyService: CurrencyService,
    private store: Store<AppState>
  ) {
    super();
    this.formData = {
      formId: 'tax-invoice-edit',
      icon: 'fal fa-file-invoice',
      title: 'Thêm mới Tax Invoice',
      isCancel: true,
      service: this.taxInvoiceService
    };
  }

  ngOnInit() {
    this.initData();
    this.getDataLocalStorageForClonceData();
  }

  /**
   * Initialize data
   */
  private initData(): void {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        // Case 1: Edit exited item
        this.currentTaxInvoiceId = params.id; // Set current params id
        this.taxInvoiceService.selectById(params.id).subscribe(res => {
          if (!!res) { // When response is not null, load data
            this.taxInvoiceData = res;
            if (this.taxInvoiceData.vendorId) {
              this.taxInvoiceData.vendorIdDto = {
                code: this.taxInvoiceData.vendorId,
                name: this.taxInvoiceData.supplierName
              };
            }
            if (this.taxInvoiceData.creatorId) {
              this.taxInvoiceData.createdByTaxInvoiceDto = {
                id: this.taxInvoiceData.creatorId,
                fullName: this.taxInvoiceData.creatorName
              };
            }

            if (this.taxInvoiceData.poCode) {
              this.taxInvoiceData.poCodeDto = {
                code: this.taxInvoiceData.poCode
              };
            }

            if (this.taxInvoiceData.currency) {
              this.taxInvoiceData.currencyDto = {
                name: this.taxInvoiceData.currency
              };
            }
            this.cdr.detectChanges(); // Detect changes on screen
            setTimeout(() => {
              this.form.form.markAsPristine();
            }, 0);
          } else { // When response is not null, redirect to parent page
            this.redirectToParentPage();
          }
        });
      } else {
        // Case 2: Create new item
        this.taxInvoiceData = {};
        // Default trạng thái Tax Invoice là chưa map COM
        this.taxInvoiceData.status = 1;

        // auto gen id
        this.taxInvoiceData.id = Guid.create().toString().split('-').join('');
        this.store.select(currentUser).pipe(take(1)).subscribe(res => {
          if (res) {
            this.taxInvoiceData.creatorId = res.id;
            this.taxInvoiceData.createdByTaxInvoiceDto = this.toDto('fullName', res.fullName);
          }
        });
        // Default Ngày Tax Invoice là ngày hiện tại
        this.taxInvoiceData.date = new Date();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.form.form.markAsPristine();
        }, 0);
      }
    });
    this.subscriptions.push(routeSub);
  }

  private getDataLocalStorageForClonceData(): void {
    if (window.history.state.rowTaxInvoiceClone) {
      this.taxInvoiceData = window.history.state.rowTaxInvoiceClone;
      this.taxInvoiceData.id = null;
      if (this.taxInvoiceData.vendorId) {
        this.taxInvoiceData.vendorIdDto = {
          code: this.taxInvoiceData.vendorId,
          name: this.taxInvoiceData.supplierName
        };
      }
      if (this.taxInvoiceData.creatorId) {
        this.taxInvoiceData.createdByTaxInvoiceDto = {
          id: this.taxInvoiceData.creatorId,
          fullName: this.taxInvoiceData.creatorName
        };
      }
    }
  }

  public onBtnSaveClick() {
    if (this.form) {
      if (!this.validateForm(this.form, this.formData.formId)) {
        return;
      }
      const saveSub = this.taxInvoiceService.merge(this.taxInvoiceData).subscribe(res => {
        if (res && res.id) {
          if (this.currentTaxInvoiceId) {
            this.router.navigate([`../../edit/${res.id}`], { relativeTo: this.route });
           } else {
            this.router.navigate([`../edit/${res.id}`], { relativeTo: this.route });
           }
          this.initData();
          this.notificationService.showSuccess();
        }
      });
      this.subscriptions.push(saveSub);
    }
  }

  public onBtnCancelClick(): void {
    this.location.back();
    // this.redirectToParentPage();
  }

  public onChangeSupplier(supplierDto: any): void {
    if (supplierDto) {
      this.taxInvoiceData.supplierName = supplierDto.name;
      this.taxInvoiceData.vendorId = supplierDto.vendorId;
    } else {
      this.taxInvoiceData.supplierName = null;
      this.taxInvoiceData.vendorId = null;
    }
  }

  private redirectToParentPage(): void {
    if (this.currentTaxInvoiceId) {
      this.router.navigate([`../../`], { relativeTo: this.route });
     } else {
       this.router.navigate([`../`], { relativeTo: this.route });
     }
  }

  public onChangeMaturityDate(event: any): void {
    if (event) {
      // get week
      const temp = new Date(event);
      const onejan = new Date(temp.getFullYear(), 0, 1);
      const millisecsInDay = 86400000;
      const week = Math.ceil((((temp.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay() + 1) / 7);
      this.taxInvoiceData.maturityWeek = week;
    }
  }

  public onChangePoCode(event: any): void {
    this.taxInvoiceData.poCode = event ? event.code : '';

  }

  public onChangeValuePaid(event: any): void {
    this.taxInvoiceData.valueUnpaid = this.taxInvoiceData.value - event;
  }
  public onChangeTaxValue(event: any): void {
    this.taxInvoiceData.valueUnpaid = event - this.taxInvoiceData.valuePaid;
  }
  public onChangeCurrency() {
    this.taxInvoiceData.currency = this.taxInvoiceData.currencyDto ? this.taxInvoiceData.currencyDto.name : null;
    // set giá trị exchangeRateType về null
    this.taxInvoiceData.exchangeRateType = null;
  }
  public onChangeExchangeRate(exchangeRateData: any): void {
    if (exchangeRateData) {
      this.taxInvoiceData.exchangeRateDate = exchangeRateData.date;
      this.taxInvoiceData.exchangeRateType = exchangeRateData.type;
      this.taxInvoiceData.conversionRate = exchangeRateData.conversionRate;
    }
  }

  public focusOutCheckExists(): void {
    const requestCheckExits = new TaxInvoiceRequestPayload();
    requestCheckExits.type = 'all';
    this.taxInvoiceService.select(requestCheckExits).subscribe(res => {
      if (res) {
        if (this.taxInvoiceData.vendorId && res.find(x => x.vendorId === this.taxInvoiceData.vendorId
          && x.code === this.taxInvoiceData.code)) {
          if (this.form.form.controls[`code`] && this.form.form.controls[`code`].value) {
            this.form.form.controls[`code`].setErrors({ ALREADY_EXISTS: true });
          }
        } else {
          if (this.form.form.controls[`code`] && this.form.form.controls[`code`].value) {
            this.form.form.controls[`code`].setErrors(null);
          }
        }
      }
      this.cdr.detectChanges();
    });
  }
}
