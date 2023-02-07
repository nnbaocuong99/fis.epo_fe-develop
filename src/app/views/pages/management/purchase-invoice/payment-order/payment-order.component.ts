import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { ToolbarModel } from '../../../../partials/content/toolbar/toolbar.model';
import * as config from './payment-order.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { ExpenseService } from '../../../../../services/modules/expense/expense.service';
import { DeleteConfirmation } from '../../../../../services/common/confirmation';
import { DataEpaymentRequestPayload } from '../../../../../services/modules/data-ePayment/data-ePayment-request-payload';
import { DataEpaymentService } from '../../../../../services/modules/data-ePayment/data-ePayment.service';
import { ExpenseRequestSaveDto } from '../../../../../services/modules/expense/expense-request-payload';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { Guid } from 'guid-typescript';
import { Location } from '@angular/common';

export enum PaymentTypes {
  Payment = 'PAYMENT',
  PrePayment = 'PREPAYMENT',
  AdvancePayment = 'ADVANCEPAYMENT'
}
@Component({
  selector: 'app-payment-order',
  templateUrl: './payment-order.component.html',
  styleUrls: ['./payment-order.component.scss']
})
export class PaymentOrderComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  selectedRowData: any;
  btnItems: MenuItem[] = [
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewClick(this.selectedRowData.id) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedRowData.id) },
    // tslint:disable-next-line:max-line-length
    { label: 'Đồng bộ dữ liệu ePayment -> ePo', icon: 'pi pi-replay', command: () => this.onBtnSyncdataFromEpayment(this.selectedRowData) }
  ];

  public toolbarModel: ToolbarModel;
  public headers = config.HEADER;
  public epaySataus = config.STATUS;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public paymentType = config.PAYMENT_TYPE;
  public request: any = {};
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public currentPiId: string;
  public supplierData = [];
  public categoryAsyncsData = [];

  constructor(
    public expenseService: ExpenseService,
    public dataEpaymentService: DataEpaymentService,
    public supplierService: SupplierService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    public notification: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.currentPiId = params.id;
        this.request.piId = params.id;
      } else {
        this.currentPiId = null;
      }
    });
    this.subscriptions.push(routeSub);
    this.configToolbar();
    this.initData();
    this.pagingData();
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.search.show = false;
    this.toolbarModel.add.click = () => this.btnAddPaymentOrder();
  }

  public goBack(): void {
    this.location.back();
  }

  public btnAddPaymentOrder(): void {
    this.router.navigate([`../../add`],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          piId: this.currentPiId
        }
      });
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requestMasterData = new DataEpaymentRequestPayload();
    requestMasterData.type = 'CategoryAsyncs';
    const requests = [
      this.expenseService.select(this.request),
      this.expenseService.count(this.request),
      this.dataEpaymentService.selectMasterData(requestMasterData),
      this.supplierService.select()
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.dataSource.paginatorTotal = response[1];
        this.categoryAsyncsData = response[2];
        this.supplierData = response[3];
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

  public onBtnEditClick(id: string): void {
    this.router.navigate([`../../edit/${id}`], { relativeTo: this.activatedRoute });
  }

  public onBtnViewClick(id: string): void {
    this.router.navigate([`../../view/${id}`], { relativeTo: this.activatedRoute });
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.expenseService.delete(id).subscribe(() => {
        this.initData();
        this.notification.showDeteleSuccess();
      });
    };
    this.notification.confirm(confirmation);
  }

  public onShowContextMenu() {
    // this.btnItems[0].visible = !this.selectedRowData.status;
    this.btnItems[1].visible = !this.selectedRowData.epayId || this.selectedRowData.status === 1;
    this.btnItems[3].visible = this.selectedRowData.status !== 1 && this.selectedRowData.epayId;
  }

  public onBtnSyncdataFromEpayment(rowData: any): void {
    const request = new DataEpaymentRequestPayload();
    request.epayId = rowData.epayId;
    this.dataEpaymentService.SelectByIdTicketEpayment(request).subscribe(res => {
      if (res) {
        // save data
        const requestSave = this.createRequestSave(rowData, res);
        const saveSub = this.expenseService.save(requestSave).subscribe(obj => {
          if (obj && obj.id) {
            this.notification.showSuccess();
            this.initData();
          }
        });
        this.subscriptions.push(saveSub);
      }
    });
  }

  private createRequestSave(rowData: any, res: any) {
    const requestSave = new ExpenseRequestSaveDto();

    const expense = JSON.parse(JSON.stringify(rowData));
    expense.beneficiaryType = res.BeneficiaryType;

    // expense.budgetPeriod = res.BudgetPeriod;
    // expense.budgetPeriodNumber = res.BudgetPeriodNumber;

    expense.deadline = res.Deadline;
    this.categoryAsyncsData.filter(x => {
      if (+x.Code === res.Deadline) {
        expense.deadlineName = x.Description;
      }
    });
    expense.legalStandingId = res.LegalStandingId;
    expense.legalStandingName = res.LegalStandingEntity ? (res.LegalStandingEntity.Code + ' - ' + res.LegalStandingEntity.Name) : null;
    expense.method = res.Method;
    expense.note = res.Note;
    expense.organizationId = res.OrganizationId;
    expense.organizationName = res.OrganizationEntity ? (res.OrganizationEntity.Filter + ' - ' + res.OrganizationEntity.Name) : null;
    expense.submitDate = res.SubmitDate;
    expense.title = res.Title;
    expense.status = 3;

    expense.supplierTax = res.SupplierCode;
    this.supplierData.filter(x => {
      if (x.taxCode.toString() === res.SupplierCode) {
        expense.vendorId = x.vendorId;
      }
    });

    expense.convertedSubTotal = res.ConvertedSubTotal;
    expense.convertedTotal = res.ConvertedTotal;
    expense.unpaidAmount = res.UnpaidAmount;
    requestSave.expense = expense;

    if (rowData.type === PaymentTypes.Payment) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < res.BillEntities.length; i++) {
        const items = res.BillEntities[i];
        const billTemp = this.convertData(items, null);
        billTemp.id = Guid.create().toString();
        billTemp.expenseId = requestSave.expense.id;
        billTemp.indexNo = i + 1;
        requestSave.expenseBill.push(billTemp);

        for (let j = 0; j < items.PaymentEntities.length; j++) {
          const paymentTemp = this.convertData(null, items.PaymentEntities[j]);
          paymentTemp.id = Guid.create().toString();
          paymentTemp.expenseId = requestSave.expense.id;
          paymentTemp.billId = billTemp.id;
          paymentTemp.indexNo = (i + 1) + '.' + (j + 1);
          requestSave.expensePayment.push(paymentTemp);
        }
      }

    } else if (rowData.type === PaymentTypes.PrePayment) {
      for (let i = 0; i < res.PrePaymentEntities.length; i++) {
        const paymentTemp = this.convertData(null, res.PrePaymentEntities[i]);
        paymentTemp.id = Guid.create().toString();
        paymentTemp.expenseId = requestSave.expense.id;
        paymentTemp.indexNo = i + 1;
        requestSave.expensePayment.push(paymentTemp);
      }
    } else {
      // hóa đơn AdvancePayment
      for (let i = 0; i < res.AdvancePaymentEntities.length; i++) {
        const paymentTemp = this.convertData(null, res.AdvancePaymentEntities[i]);
        paymentTemp.id = Guid.create().toString();
        paymentTemp.expenseId = requestSave.expense.id;
        paymentTemp.indexNo = i + 1;
        requestSave.expensePayment.push(paymentTemp);
      }
    }

    return requestSave;
  }

  public convertData(bill: any, payment: any) {
    // tslint:disable-next-line:prefer-const
    let data: any = {};
    if (bill) {
      data.billTypeId = bill.BillTypeId;
      data.billTypeName = bill.BillTypeEntity ? bill.BillTypeEntity.Name : null;
      data.supplierTax = bill.SupplierCode;
      this.supplierData.filter(x => {
        if (x.taxCode.toString() === bill.SupplierCode) {
          data.vendorId = x.vendorId;
        }
      });

      data.createdDate = bill.CreatedDate;
      data.content = bill.Content;
      data.description = bill.Description;
      data.formNo = bill.FormNo;
      data.seri = bill.Seri;
      data.number = bill.Number;
      data.exchangeCurrency = bill.ExchangeCurrency;
      data.exchangeRate = bill.ExchangeRate;
      data.exchangeTime = bill.ExchangeTime;
      data.subTotal = bill.SubTotal;
      data.total = bill.Total;
      data.taxTypeId = bill.TaxTypeId;
      data.taxTypeName = bill.TaxTypeEntity ? bill.TaxTypeEntity.Name : null;
      data.taxAmount = bill.TaxAmount;
      data.convertedSubTotal = bill.ConvertedSubTotal;
      data.convertedTotal = bill.ConvertedTotal;
    }
    if (payment) {
      data.organizationId = payment.OrganizationId;
      // tslint:disable-next-line:max-line-length
      data.organizationName = payment.OrganizationEntity ? (payment.OrganizationEntity.Filter + ' - ' + payment.OrganizationEntity.Name) : null;

      data.parentProjectId = payment.ParentProjectId;
      data.parentProjectName = payment.ParentProjectEntity ? payment.ParentProjectEntity.Code : null;

      data.projectId = payment.ProjectEntity ? payment.ProjectEntity.Id : null;
      data.projectName = payment.ProjectEntity ? payment.ProjectEntity.Code : null;

      data.projectBudgetId = payment.ProjectBudgetId;
      data.projectBudgetName = payment.ProjectBudgetEntity ? payment.ProjectBudgetEntity.MasterBudgetEntity.Code : null;

      data.title = payment.Title;
      data.quantity = payment.Quantity;
      data.unitPrice = payment.UnitPrice;
      data.price = payment.Price;
      data.convertedPrice = payment.ConvertedPrice;
      data.convertedTotalPrice = payment.ConvertedTotalPrice;
      data.totalPrice = payment.TotalPrice;
      data.authorizedPayment = payment.AuthorizedPayment === true ? 1 : 0;
      data.account = payment.AccountingAccountCode;
      data.contractNumber = payment.ContractNumber;
      data.contractDate = payment.ContractDate;
      data.contractAmount = payment.ContractAmount;

      data.taxAmount = payment.TaxAmount;
      data.exchangeCurrency = payment.ExchangeCurrency;
      data.exchangeRate = payment.ExchangeRate;
      data.taxTypeId = payment.TaxTypeId;
      data.taxTypeName = payment.TaxTypeEntity ? payment.TaxTypeEntity.Name : null;
    }
    return data;
  }

  public openNewTab(rowData: any) {
    // Converts the route into a string that can be used
    // with the window.open() function
    if (rowData.epayId) {
      const url = `https://dev.epayment.ho.fpt.vn/Form/CreateExpense?ExpenseId=${rowData.epayId}`;
      window.open(url, '_blank');
    } else {
      this.notification.showError('Lỗi !!!');
      alert('Không có Id ePay');
    }
  }

  public convertCurrencyMask(price: any): string {
    if (price !== null && price !== undefined) {
      const result = this.format(price, 0, 3, ',', '.');
      return result;
    } else {
      return '';
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


}
