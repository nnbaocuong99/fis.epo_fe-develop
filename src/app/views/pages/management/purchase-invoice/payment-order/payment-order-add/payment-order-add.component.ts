import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { SaveConfirmation } from '../../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';
import { ExpenseService } from '../../../../../../services/modules/expense/expense.service';
import { UserService } from '../../../../../../services/modules/user/user.service';
import * as configParent from '../payment-order.config';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';
import { currentUser } from '../../../../../../core/auth';
import { take } from 'rxjs/operators';
import { DataEpaymentService } from '../../../../../../services/modules/data-ePayment/data-ePayment.service';
import { DataEpaymentRequestPayload } from '../../../../../../services/modules/data-ePayment/data-ePayment-request-payload';
import { ExpenseRequestSaveDto } from '../../../../../../services/modules/expense/expense-request-payload';
import { PaymentOrderItemComponent } from './payment-order-item/payment-order-item.component';
import { PaymentOrderPrepayComponent } from './payment-order-prepay/payment-order-prepay.component';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { Guid } from 'guid-typescript';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoiceItemService } from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { forkJoin } from 'rxjs';
import {
  PurchaseInvoiceItemRequestPayload
} from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.request-payload';
import { PurchaseOrderService } from '../../../../../../services/modules/purchase-order/purchase-order.service';
import { PurchaseInvoiceRequestPayload } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { Location } from '@angular/common';

export enum PaymentTypes {
  Payment = 'PAYMENT',
  PrePayment = 'PREPAYMENT',
  AdvancePayment = 'ADVANCEPAYMENT'
}

export enum MasterDataTypes {
  Organizations = 'Organizations',
  CategoryAsyncs = 'CategoryAsyncs',
  LegalStandings = 'LegalStandings',
  LegalStandingsDefault = 'LegalStandingsDefault',
  Projects = 'Projects'
}
@Component({
  selector: 'app-payment-order-add',
  templateUrl: './payment-order-add.component.html',
  styleUrls: ['./payment-order-add.component.scss']
})
export class PaymentOrderAddComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: false }) form: NgForm;
  @ViewChild('paymentOrderItem', { static: false }) paymentOrderItem: PaymentOrderItemComponent;
  @ViewChild('paymentOrderPrepay', { static: false }) paymentOrderPrepay: PaymentOrderPrepayComponent;

  public titleForm = 'PAYMENT_ORDER.PAYMENT_ORDER_TITLE';
  public paymentOrderData: any = {};
  public paymentMethod = configParent.PAYMENT_METHOD;
  public beneficiaryType = configParent.BENEFICIARY_TYPE;
  public tabs = [];
  public currentPiId: string;
  public currentExpenseId: string;
  public currentTab: number;
  public useNameLoginData: any = {};
  public selectedBudgetPeriodYear = [];

  public organizationsData = [];
  public categoryAsyncsData = [];
  public legalStandingsData = [];
  public projectParentData = [];
  public projectChilData = [];
  public purchaseOrderData = [];
  public purchaseinvoice: any = {};
  public purchaseInvoiceItem: any = [];
  public isShowCopyInv = false;
  public dialogRefPi: DialogRef = new DialogRef();
  public organizationEpaymentRequestPayload = new DataEpaymentRequestPayload();
  public legalStandingIdEpaymentRequestPayload = new DataEpaymentRequestPayload();
  public categoryAsyncsEpaymentRequestPayload = new DataEpaymentRequestPayload();
  public billTypesEpaymentRequestPayload = new DataEpaymentRequestPayload();
  public taxTypesEpaymentRequestPayload = new DataEpaymentRequestPayload();

  constructor(
    public expenseService: ExpenseService,
    public userService: UserService,
    public supplierService: SupplierService,
    public currencyService: CurrencyService,
    public purchaseOrderService: PurchaseOrderService,
    public purchaseInvoiceService: PurchaseInvoiceService,
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    private notificationService: NotificationService,
    public dataEpaymentService: DataEpaymentService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    this.getDefaultConfig();
  }

  public getDefaultConfig(): void {
    const selectedBudgetPeriodYearTemp = new Date().getFullYear();
    this.selectedBudgetPeriodYear = [];
    for (let i = 1; i <= 12; i++) {
      this.selectedBudgetPeriodYear.push({ value: (i < 10 ? '0' + i : i) + '-' + selectedBudgetPeriodYearTemp });
    }
    this.organizationEpaymentRequestPayload.type = MasterDataTypes.Organizations;
    this.legalStandingIdEpaymentRequestPayload.type = MasterDataTypes.LegalStandings;
    this.categoryAsyncsEpaymentRequestPayload.type = MasterDataTypes.CategoryAsyncs;

    this.getMasterDataControl(MasterDataTypes.Organizations);
    this.getMasterDataControl(MasterDataTypes.CategoryAsyncs);
    this.getMasterDataControl(MasterDataTypes.LegalStandings);

    const temp = this.store.select(currentUser).pipe(take(1)).subscribe(res => {
      this.useNameLoginData = res ? res : null;
      this.initDataPaymentOrder();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(temp);
  }

  public getMasterDataControl(type: string): void {
    const request = new DataEpaymentRequestPayload();
    request.type = type;
    // tslint:disable-next-line:max-line-length
    if ((type === MasterDataTypes.LegalStandings || type === MasterDataTypes.LegalStandingsDefault) && this.paymentOrderData && this.paymentOrderData.organizationId) {
      request.organizationId = this.paymentOrderData.organizationId;
    }
    const temp = this.dataEpaymentService.selectMasterData(request).subscribe(res => {
      if (res) {
        if (type === MasterDataTypes.Organizations) {
          // Fix search control
          this.organizationsData = res.map(x => {
            x.Search_label = `${x.Filter} ${'-'} ${x.Name}`;
            return x;
          });
        }
        if (type === MasterDataTypes.CategoryAsyncs) {
          // Fix search control
          this.categoryAsyncsData = res.map(x => {
            x.Search_label = `${x.Description}`;
            x.Code = +x.Code;
            return x;
          });
        }
        if (type === MasterDataTypes.LegalStandings) {
          // Fix search control
          this.legalStandingsData = res.map(x => {
            x.Search_label = `${x.Code} ${'-'} ${x.Name}`;
            return x;
          });
        }
        if (type === MasterDataTypes.LegalStandingsDefault) {
          this.paymentOrderData.legalStandingIdDto = res;
          this.paymentOrderData.legalStandingId = this.paymentOrderData.legalStandingIdDto.Id;
          // tslint:disable-next-line:max-line-length
          this.paymentOrderData.legalStandingName = this.paymentOrderData.legalStandingIdDto.Code + ' - ' + this.paymentOrderData.legalStandingIdDto.Name;
        }

        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(temp);
  }

  public initDataPaymentOrder(): void {
    const routeSub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        // this.formData.title = 'PURCHASE_INVOICE.INVOICE_INFORMATION';
        // Case 1: When edit an item
        this.currentExpenseId = params.id;
        const temp = this.expenseService.selectById(this.currentExpenseId).subscribe(res => {
          if (res) {
            this.paymentOrderData = res;
            // tslint:disable-next-line:max-line-length
            this.paymentOrderData.organizationIdDto = { Filter: this.paymentOrderData.organizationName.split('-')[0], Name: this.paymentOrderData.organizationName.split('-')[1] };
            this.paymentOrderData.legalStandingIdDto = { Code: this.paymentOrderData.legalStandingName.split('-')[0] };
            this.paymentOrderData.deadlineDto = { Description: this.paymentOrderData.deadlineName };
            this.currentPiId = this.paymentOrderData.piId ? this.paymentOrderData.piId : null;
            if (this.paymentOrderData.type === PaymentTypes.Payment) {
              this.currentTab = 1;
              this.tabs.push(configParent.TABS[0]);
            } else if (this.paymentOrderData.type === PaymentTypes.PrePayment) {
              this.currentTab = 2;
              this.tabs.push(configParent.TABS[1]);
            } else {
              this.currentTab = 3;
              this.tabs.push(configParent.TABS[2]);
            }
            this.paymentOrderDto(this.paymentOrderData);
          }
          setTimeout(() => {
            this.form.form.markAsPristine();
          }, 50);
          this.cdr.detectChanges();
        });
        this.subscriptions.push(temp);
      } else {
        this.tabs = configParent.TABS;
        this.paymentOrderData.type = PaymentTypes.Payment;
        this.currentTab = this.tabs[0].value;
        this.queryParamsRouter();
        this.defaultAddForm();
      }
    });
    this.subscriptions.push(routeSub);
  }

  public setFragmentToRoute(event: any): void {
    if (event && !this.currentExpenseId) {
      this.currentTab = event.nextId;
      // form Add
      this.paymentOrderData = {};
      // tslint:disable-next-line:max-line-length
      this.paymentOrderData.type = this.currentTab === 1 ?
        PaymentTypes.Payment : (this.currentTab === 2 ? PaymentTypes.PrePayment : PaymentTypes.AdvancePayment);
      this.defaultAddForm();
    }

    if (this.currentTab === 1 && this.purchaseinvoice.paymentTerm) {
      const paymentTermNumber = this.purchaseinvoice.paymentTerm ? this.purchaseinvoice.paymentTerm.replace(/[^0-9]/g, '') : null;
      this.paymentOrderData.deadline = paymentTermNumber;
      this.paymentOrderData.deadlineName = this.purchaseinvoice.paymentTermName;
      this.paymentOrderData.deadlineDto = { Description: this.paymentOrderData.deadlineName };
    }
    this.getDataBindingOrganizationAndLegalStandings(this.purchaseinvoice);
  }

  public defaultAddForm(): void {
    this.paymentOrderData.id = Guid.create().toString();
    this.paymentOrderData.piId = this.currentPiId;
    // default người tạo đề nghị thanh toán là người đăng nhập
    this.paymentOrderData.userName = this.useNameLoginData.userName;
    this.paymentOrderData.userId = this.useNameLoginData.id;

    // default bên nhận NCC
    this.paymentOrderData.beneficiaryType = 'SUPPLIER';

    if (this.currentTab !== 2) {
      this.paymentOrderData.method = 'BANK';
    }

    // Default ngày tạo đề nghị thanh toán là ngày hiện tại
    const date = new Date();
    this.paymentOrderData.submitDate = date;

    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1;
    this.paymentOrderData.budgetPeriod = (month < 10 ? '0' + month : month) + '-' + year;
    this.paymentOrderData.budgetPeriodNumber = year + (month < 10 ? '0' + month : month);

    // Binding thông tin NCC theo hóa đơn
    if (this.purchaseinvoice.code) {
      if (this.currentTab !== 3) {
        this.paymentOrderData.supplierTax = this.purchaseinvoice.supplierTax;
        this.paymentOrderData.vendorId = this.purchaseinvoice.vendorId;
        this.paymentOrderData.supplierName = this.purchaseinvoice.supplierName;
      }
      this.paymentOrderData.title = this.purchaseinvoice.invoiceDesc + '->' + this.purchaseinvoice.code;
    }

    this.paymentOrderDto(this.paymentOrderData);

    if (this.purchaseinvoice) {
      if (this.form) {
        this.form.form.markAsDirty();
      }
    } else {
      setTimeout(() => {
        this.form.form.markAsPristine();
      }, 50);
    }
  }

  private queryParamsRouter(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.piId) {
        this.currentPiId = params.piId;
        this.onGetPurchaseInvoiceData(this.currentPiId);
      }
    });
  }

  private onGetPurchaseInvoiceData(piId: string): void {
    const requestPi = new PurchaseInvoiceRequestPayload();
    requestPi.id = piId;
    const requestPiItem = new PurchaseInvoiceItemRequestPayload();
    requestPiItem.piId = piId;

    const categorySub = forkJoin([
      // Get purchase invoice
      this.purchaseInvoiceService.select(requestPi),
      // Get purchase invoice item
      this.purchaseInvoiceItemService.select(requestPiItem),
    ]).subscribe((res) => {
      this.purchaseinvoice = res[0] && res[0].length > 0 ? res[0][0] : {};
      this.purchaseInvoiceItem = res[1];
      const arr = [];
      const dataTemp = [];
      let taxAmount = 0;
      for (const item of this.purchaseInvoiceItem) {
        taxAmount += item.taxAmount;
        if (item.poId && !arr.find(x => x === item.poId)) {
          arr.push(item.poId);
          this.purchaseOrderService.selectById(item.poId).subscribe(obj => {
            if (obj) {
              dataTemp.push(obj);
            }
          });
        }
      }
      this.purchaseinvoice.taxAmount = taxAmount;
      if (this.purchaseinvoice.invoiceType === 'PrePayment Invoice' && !this.currentExpenseId) {
        const event = { activeId: 1, nextId: 2 };
        this.tabs = [];
        this.tabs.push(configParent.TABS[1]);
        this.setFragmentToRoute(event);
      } else {
        this.purchaseOrderData = dataTemp;
        // Binding thông tin NCC theo hóa đơn
        if (this.purchaseinvoice) {
          if (this.currentTab !== 3) {
            this.paymentOrderData.supplierTax = this.purchaseinvoice.supplierTax;
            this.paymentOrderData.vendorId = this.purchaseinvoice.vendorId;
            this.paymentOrderData.supplierName = this.purchaseinvoice.supplierName;
            this.paymentOrderData.supplierNameDto = this.toDto('name', this.paymentOrderData.supplierName);
          }
          this.paymentOrderData.title = this.purchaseinvoice.invoiceDesc + '->' + this.purchaseinvoice.code;

          this.getDataBindingOrganizationAndLegalStandings(this.purchaseinvoice);
          if (this.currentTab === 1 && this.purchaseinvoice.paymentTerm) {
            const paymentTermNumber = this.purchaseinvoice.paymentTerm ? this.purchaseinvoice.paymentTerm.replace(/[^0-9]/g, '') : null;
            this.paymentOrderData.deadline = paymentTermNumber;
            this.paymentOrderData.deadlineName = this.purchaseinvoice.paymentTermName;
            this.paymentOrderData.deadlineDto = { Description: this.paymentOrderData.deadlineName };
            this.cdr.detectChanges();
          }
        }
      }
    });
    this.subscriptions.push(categorySub);
  }

  public paymentOrderDto(source: any): void {
    this.paymentOrderData.createdByDto = this.toDto('userName', source.userName);
    this.paymentOrderData.supplierNameDto = this.toDto('name', source.supplierName);
    this.cdr.detectChanges();
  }

  public goBack(): void {
    this.location.back();
    // if (this.currentPiId) {
    //   this.router.navigate([`payment-order/list/${this.currentPiId}`], { relativeTo: this.activatedRoute.parent });
    // } else {
    //   this.router.navigate([`../../list`], { relativeTo: this.activatedRoute.parent });
    // }
  }

  public onBtnCancelClick(): void {
    if (this.currentPiId) {
      this.router.navigate([`payment-order/list/${this.currentPiId}`], { relativeTo: this.activatedRoute.parent });
    } else {
      this.router.navigate([`payment-order/list`], { relativeTo: this.activatedRoute.parent });
    }
  }

  public onBtnCreateDraftEpaymentTicketClick(type: number): void {
    if (type === 1) {
      if (this.form) {
        if (!this.validateForm(this.form, 'payment-order-edit')) {
          this.notificationService.showMessage('VALIDATION.FORM_VALID');
          return;
        }

        if (this.form.dirty) {
          const saveConfirmation = new SaveConfirmation();
          saveConfirmation.accept = () => {
            const requestSave = this.createRequestSave();
            const saveSub = this.expenseService.save(requestSave).subscribe(res => {
              if (res && res.id) {
                this.currentExpenseId = res.id;
                this.processCreateTickeDraftEpay(res.id);
              }
            });
            this.subscriptions.push(saveSub);
          };
          this.notificationService.confirm(saveConfirmation);
        } else {
          this.goList();
        }
      }
    } else {
      if (this.form && this.form.dirty) {
        this.notificationService.showWarning('Vui lòng thực hiện lưu thông tin trước khi thực hiện hành động này !!!');
      } else {
        this.processCreateTickeDraftEpay(this.currentExpenseId);
      }
    }
  }

  public processCreateTickeDraftEpay(expenseId: string): void {
    const request = new DataEpaymentRequestPayload();
    request.id = expenseId;
    this.dataEpaymentService.createDraft(request).subscribe(res => {
      if (res) {
        this.notificationService.showSuccess();
        this.paymentOrderData.hidebtnCreateDraftEpayment = true;
        this.openNewTab(res.Data.Id);
        this.goList();
        this.cdr.detectChanges();
      }
    });
  }

  public openNewTab(ePayId: any) {
    // Converts the route into a string that can be used
    // with the window.open() function
    if (ePayId) {
      const url = `https://dev.epayment.ho.fpt.vn/Form/CreateExpense?ExpenseId=${ePayId}`;
      window.open(url, '_blank');
    } else {
      this.notificationService.showError('Lỗi !!!');
      alert('Không có Id ePay');
    }
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'payment-order-edit')) {
        this.notificationService.showMessage('VALIDATION.FORM_VALID');
        return;
      }

      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          const requestSave = this.createRequestSave();
          const saveSub = this.expenseService.save(requestSave).subscribe(res => {
            if (res && res.id) {
              this.currentExpenseId = res.id;
              this.goView();
              this.notificationService.showSuccess();
            }
          });
          this.subscriptions.push(saveSub);
        };
        this.notificationService.confirm(saveConfirmation);
      } else {
        this.goList();
      }
    }
  }

  public goView(): void {
    this.router.navigate([`payment-order/view/${this.currentExpenseId}`], { relativeTo: this.activatedRoute.parent });
  }

  public goList(): void {
    this.router.navigate([`payment-order/list/${this.currentPiId}`], { relativeTo: this.activatedRoute.parent });
  }

  private createRequestSave() {
    const requestSave = new ExpenseRequestSaveDto();
    if (!this.paymentOrderData.status) {
      this.paymentOrderData.status = 1;         // Trạng thái mới tạo, chưa create ticket draft
    }
    requestSave.expense = this.paymentOrderData;
    if (this.currentTab === 1 && this.paymentOrderItem.dataSource.items && this.paymentOrderItem.dataSource.items.length > 0) {
      for (const item of this.paymentOrderItem.dataSource.items) {
        requestSave.expenseBill.push(item);
        item.paymentData.map(x => {
          requestSave.expensePayment.push(x);
        });
      }
    } else {
      requestSave.expensePayment = this.paymentOrderPrepay.paymentData;
    }

    if (!this.currentExpenseId) {
      requestSave.expenseBill.map(x => {
        x.expenseId = requestSave.expense.id;
      });
      requestSave.expensePayment.map(x => {
        x.expenseId = requestSave.expense.id;
      });
    }
    return requestSave;
  }

  public onChangeBudgetPeriod(event: any): void {
    if (event) {
      const temp = event.value.split('-');
      this.paymentOrderData.budgetPeriodNumber = temp[1] + temp[0];
    } else {
      this.paymentOrderData.budgetPeriod = null;
      this.paymentOrderData.budgetPeriodNumber = null;
    }
    if (this.purchaseinvoice) {
      this.getDataBindingProject(this.purchaseinvoice);
    }
  }

  public onChangeOrganizationsData(event: any): void {
    if (event) {
      this.paymentOrderData.organizationId = event.Id;
      this.paymentOrderData.organizationName = event.Filter + ' - ' + event.Name;
      this.legalStandingIdEpaymentRequestPayload.organizationId = event.Id;
      this.getMasterDataControl(MasterDataTypes.LegalStandingsDefault);

      // binding đơn vị phê duyệt xuống đơn vị chịu thuế table
      if (this.paymentOrderData.type === PaymentTypes.Payment) {
        for (const item of this.paymentOrderItem.dataSource.items) {
          for (const obj of item.paymentData) {
            obj.organizationId = event.Id;
            obj.organizationName = event.Filter + ' - ' + event.Name;
          }
        }
      } else {
        for (const item of this.paymentOrderPrepay.paymentData) {
          item.organizationId = event.Id;
          item.organizationName = event.Filter + ' - ' + event.Name;
        }
      }
    } else {
      this.paymentOrderData.organizationId = null;
      this.paymentOrderData.organizationName = null;
      this.legalStandingIdEpaymentRequestPayload.organizationId = null;
    }
  }

  public onChangeLegalStandingsData(event: any): void {
    if (event) {
      this.paymentOrderData.legalStandingId = event.Id;
      this.paymentOrderData.legalStandingName = event.Code + ' - ' + event.Name;
    } else {
      this.paymentOrderData.legalStandingId = null;
      this.paymentOrderData.legalStandingName = null;
    }
  }

  public onChangeCategoryAsyncsData(event: any): void {
    if (event) {
      this.paymentOrderData.deadline = event.Code;
      this.paymentOrderData.deadlineName = event.Description;
    }
  }

  public onChangeSupplier(event: any): void {
    if (event) {
      this.paymentOrderData.supplierTax = event.taxCode;
      this.paymentOrderData.vendorId = event.vendorId;
    } else {
      this.paymentOrderData.supplierTax = null;
      this.paymentOrderData.vendorId = null;
    }
  }

  public getDataBindingProject(purchaseinvoice: any): void {
    if (this.paymentOrderData.organizationId && this.paymentOrderData.budgetPeriodNumber) {
      const requestProject = new DataEpaymentRequestPayload();
      requestProject.type = MasterDataTypes.Projects;
      requestProject.organizationId = this.paymentOrderData.organizationId;
      requestProject.budgetPeriod = this.paymentOrderData.budgetPeriodNumber;
      requestProject.filter = purchaseinvoice.projectCode;
      requestProject.code = purchaseinvoice.projectCode;
      const temp = this.dataEpaymentService.selectMasterData(requestProject).subscribe(res => {
        this.projectParentData = res;
        // Truyền param request dự án con
        if (this.projectParentData && this.projectParentData.length === 1) {
          requestProject.parentId = this.projectParentData[0].Id;
          requestProject.filter = null;
          this.dataEpaymentService.selectMasterData(requestProject).subscribe(obj => {
            if (obj) {
              this.projectChilData = res;
            }
            if (this.paymentOrderData.type === PaymentTypes.Payment) {
              const projectParentTemp = [];
              const projectChilTemp = [];
              for (const item of this.paymentOrderItem.dataSource.items) {
                for (const element of item.paymentData) {
                  element.parentProjectId = this.projectParentData[0].Id;
                  element.parentProjectName = this.projectParentData[0].Code;
                  element.projectId = this.projectChilData[0].Id;
                  element.projectName = this.projectChilData[0].Code;

                  if (projectParentTemp.length === 0 || !projectParentTemp.find(x => x.Id === element.parentProjectId)) {
                    projectParentTemp.push({ Id: element.parentProjectId, Code: element.parentProjectName });
                  }
                  if (projectChilTemp.length === 0 || !projectChilTemp.find(x => x.Id === element.projectId)) {
                    projectChilTemp.push({ Id: element.projectId, Code: element.projectName });
                  }
                }
              }
              this.paymentOrderItem.projectParentData = projectParentTemp;
              this.paymentOrderItem.projectChilData = projectChilTemp;
              this.cdr.detectChanges();
            } else {
              const projectParentTemp = [];
              const projectChilTemp = [];
              for (const item of this.paymentOrderPrepay.paymentData) {
                item.parentProjectId = this.projectParentData[0].Id;
                item.parentProjectName = this.projectParentData[0].Code;
                item.projectId = this.projectChilData[0].Id;
                item.projectName = this.projectChilData[0].Code;
                if (projectParentTemp.length === 0 || !projectParentTemp.find(x => x.Id === item.parentProjectId)) {
                  projectParentTemp.push({ Id: item.parentProjectId, Code: item.parentProjectName });
                }
                if (projectChilTemp.length === 0 || !projectChilTemp.find(x => x.Id === item.projectId)) {
                  projectChilTemp.push({ Id: item.projectId, Code: item.projectName });
                }
              }
              this.paymentOrderPrepay.projectParentData = projectParentTemp;
              this.paymentOrderPrepay.projectChilData = projectChilTemp;
              this.cdr.detectChanges();
            }
          });
        }
      });
      this.subscriptions.push(temp);
    }
  }

  public getDataBindingOrganizationAndLegalStandings(purchaseinvoice: any): void {
    // Xử lý binding thông tin đơn vị phê duyệt và pháp nhân
    if (purchaseinvoice.legal || purchaseinvoice.segment3) {
      const request = new DataEpaymentRequestPayload();
      request.type = MasterDataTypes.Organizations;
      request.filter = purchaseinvoice.legal ? purchaseinvoice.legal.split(' ')[1] : null;
      request.segment3 = purchaseinvoice.segment3;
      const temp = this.dataEpaymentService.selectMasterData(request).subscribe(res => {
        if (res && res.length > 0) {
          this.bindingData(res, purchaseinvoice);
        } else {
          request.filter = null;
          this.dataEpaymentService.selectMasterData(request).subscribe(obj => {
            if (obj) {
              this.bindingData(obj, purchaseinvoice);
            }
          });
        }
      });
      this.subscriptions.push(temp);
    }
  }

  public bindingData(data: any, purchaseinvoice: any): void {
    this.paymentOrderData.organizationId = data[0].Id;
    this.paymentOrderData.organizationName = data[0].Filter + ' - ' + data[0].Name;
    this.paymentOrderData.organizationIdDto = { Filter: data[0].Filter, Name: data[0].Name };
    this.getMasterDataControl(MasterDataTypes.LegalStandingsDefault);
    // Get binding Dự án cha, con
    if (purchaseinvoice.projectCode) {
      this.getDataBindingProject(purchaseinvoice);
    }
    if (this.paymentOrderData.type === PaymentTypes.Payment) {
      for (const item of this.paymentOrderItem.dataSource.items) {
        for (const obj of item.paymentData) {
          obj.organizationId = this.paymentOrderData.organizationId;
          obj.organizationName = this.paymentOrderData.organizationName;
        }
      }
    } else {
      for (const item of this.paymentOrderPrepay.paymentData) {
        item.organizationId = this.paymentOrderData.organizationId;
        item.organizationName = this.paymentOrderData.organizationName;
      }
    }
    this.cdr.detectChanges();
  }

  public onBtnCopyPiClick(): void {
    this.isShowCopyInv = false;
    this.cdr.detectChanges();
    this.isShowCopyInv = true;
    this.dialogRefPi.config = {
      style: { width: '92vw' },
      baseZIndex: 10000,
      draggable: true,
      maximizable: true,
      title: 'Danh sách hoá đơn',
      btnTitle: 'Copy'
    };
    this.dialogRefPi.input.id = this.currentPiId;
    this.dialogRefPi.input.isShowDelete = false;
    this.dialogRefPi.show();
  }

  public loadItemFromPi(data: any): void {
    if (data && data.length > 0) {
      this.paymentOrderData.piId = null;
      this.paymentOrderData.supplierTax = null;
      this.paymentOrderData.vendorId = null;
      this.paymentOrderData.supplierName = null;
      this.paymentOrderData.title = null;
      this.paymentOrderData.supplierNameDto = null;
      this.paymentOrderData.deadline = null;
      this.paymentOrderData.deadlineName = null;
      // Binding thông tin chung
      const purchaseinvoice = data[0];
      this.getDataBindingOrganizationAndLegalStandings(purchaseinvoice);
      if (this.currentTab === 1) {
        if (purchaseinvoice) {
          this.paymentOrderData.supplierTax = purchaseinvoice.supplierTax;
          this.paymentOrderData.vendorId = purchaseinvoice.vendorId;
          this.paymentOrderData.supplierName = purchaseinvoice.supplierName;
          this.paymentOrderData.supplierNameDto = this.toDto('name', this.paymentOrderData.supplierName);
          this.paymentOrderData.title = purchaseinvoice.invoiceDesc + '->' + purchaseinvoice.code;

          if (purchaseinvoice.paymentTerm) {
            const paymentTermNumber = purchaseinvoice.paymentTerm.replace(/[^0-9]/g, '');
            this.paymentOrderData.deadline = paymentTermNumber;
            this.paymentOrderData.deadlineName = purchaseinvoice.paymentTermName;
            this.paymentOrderData.deadlineDto = { Description: this.paymentOrderData.deadlineName };
          }
        }
        // Binding items
        this.paymentOrderItem.dataSource.items = [];
        let index = 0;
        for (const item of data) {
          this.paymentOrderData.piId = this.paymentOrderData.piId ? (this.paymentOrderData.piId + ',' + item.id) : item.id;
          this.paymentOrderItem.addBillNew();
          this.paymentOrderItem.bindingDataPurchaseInvoiceToTabel(this.paymentOrderItem.dataSource.items[index], item);
          index++;
        }
        this.cdr.detectChanges();
      }

      // Xử lý tab thanh toán trả trước
      if (this.currentTab === 2) {
        this.paymentOrderData.supplierTax = purchaseinvoice.supplierTax;
        this.paymentOrderData.vendorId = purchaseinvoice.vendorId;
        this.paymentOrderData.supplierName = purchaseinvoice.supplierName;
        this.paymentOrderData.supplierNameDto = this.toDto('name', this.paymentOrderData.supplierName);
        this.paymentOrderData.title = purchaseinvoice.invoiceDesc + '->' + purchaseinvoice.code;

        let strPoId = '';
        for (const item of data) {
          this.paymentOrderData.piId = this.paymentOrderData.piId ? (this.paymentOrderData.piId + ',' + item.id) : item.id;
          strPoId = strPoId && item.poId ? strPoId + ',' + item.poId : item.poId;
        }

        const arr = [];
        const dataTemp = [];
        const temp = strPoId ? strPoId.split(',') : [];
        for (const obj of temp) {
          if (!arr.find(x => x === obj)) {
            arr.push(obj);
          }
        }
        for (let i = 0; i < arr.length; i++) {
          this.purchaseOrderService.selectById(arr[i]).subscribe(res => {
            if (res) {
              dataTemp.push(res);
              if (i === arr.length - 1) {
                this.purchaseOrderData = dataTemp;
                this.cdr.detectChanges();
              }
            }
          });
        }

      }
      // Xử lý tab Tạm ứng
      if (this.currentTab === 3) {
        this.paymentOrderData.title = purchaseinvoice.invoiceDesc + '->' + purchaseinvoice.code;
        const arrTemp = [];
        for (const item of data) {
          arrTemp.push(item.id);
        }
        this.paymentOrderData.piId = arrTemp.join(',');
        this.cdr.detectChanges();
      }

      if (this.form) {
        this.form.form.markAsDirty();
      }
    }
  }

}
