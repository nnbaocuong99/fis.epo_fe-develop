import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as config from './payment-order-prepay.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { Guid } from 'guid-typescript';
import { ExpensePaymentService } from '../../../../../../services/modules/expense-payment/expense-payment.service';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { ExpensePaymentRequestPayload } from '../../../../../../services/modules/expense-payment/expense-payment.request.payload';
import { DataEpaymentRequestPayload } from '../../../../../../services/modules/data-ePayment/data-ePayment-request-payload';
import { DataEpaymentService } from '../../../../../../services/modules/data-ePayment/data-ePayment.service';
import { CurrencyRequestPayload } from '../../../../../../services/modules/category/currency/currency.request.payload';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';

export enum MasterDataTypes {
  Organizations = 'Organizations',
  Projects = 'Projects',
  ProjectBudgets = 'ProjectBudgets'
}
@Component({
  selector: 'app-payment-order-prepay',
  templateUrl: './payment-order-prepay.component.html',
  styleUrls: ['./payment-order-prepay.component.scss']
})
export class PaymentOrderPrepayComponent extends BaseFormComponent implements OnInit {
  @Input() form: any;
  @Input() type = 1;
  @Input() hasEdit = true;
  @Input() paymentOrderData: any;

  _purchaseOrderData: any;
  get purchaseOrderData(): any {
    return this._purchaseOrderData;
  }
  @Input() set purchaseOrderData(data: any) {
    this._purchaseOrderData = data;
    if (this.purchaseOrderData && this.purchaseOrderData.length > 0 && this.type === 1) {
      this.paymentData = !this.currentExpenseId ? [] : this.paymentData;
      // tslint:disable-next-line: prefer-for-of
      if (!this.paymentData || this.paymentData.length === 0) {
        this.addItemNew();
      }
      for (let i = 0; i < this.purchaseOrderData.length; i++) {
        const item = this.purchaseOrderData[i];
        if (i > 0) {
          this.addItemNew();
        }
        this.paymentData[i].contractNumber = item.code;
        this.paymentData[i].contractAmount = item.totalAmount;
        this.paymentData[i].contractDate = item.signDate;
        this.paymentData[i].exchangeCurrency = item.currency;
        this.cdr.detectChanges();
      }
    }
  }

  _purchaseinvoice: any;
  get purchaseinvoice(): any {
    return this._purchaseinvoice;
  }
  @Input() set purchaseinvoice(data: any) {
    this._purchaseinvoice = data;
    if (this.purchaseinvoice && !this.currentExpenseId) {
      if (!this.paymentData || this.paymentData === 0) {
        this.addItemNew();
        this.paymentData[0].exchangeCurrency = this.purchaseinvoice.currency;
      } else {
        this.paymentData[0].exchangeCurrency = this.purchaseinvoice.currency;
      }
    }
  }

  public currencyRequestPayload = new CurrencyRequestPayload();
  public paymentHeaders = config.HEADER_PAYMENT_ADVANCE;
  public advanceHeaders = config.HEADER_ADVANCE;
  public transferHeaders = config.HEADER_TRANSFER_INFO;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public headerCurrency = config.HEADER_CURRENCY;


  public paymentData: any;
  public currentExpenseId: string;
  // public transferData: any;
  public addPayment: any = { id: Guid.create().toString(), exchangeRate: 1, exchangeCurrency: 'VND' };
  public organizationsData = [];
  public projectParentData = [];
  public projectChilData = [];
  public budgetTypeData = [];

  constructor(
    public expensePaymentService: ExpensePaymentService,
    public dataEpaymentService: DataEpaymentService,
    public currencyService: CurrencyService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {

    this.getMasterDataControl(MasterDataTypes.Organizations);
    const routeSub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.currentExpenseId = params.id;
        this.initData();
      } else {
        if (!this.paymentData || this.paymentData.length === 0) {
          this.addItemNew();
        }
      }
    });
    this.subscriptions.push(routeSub);
  }

  public getMasterDataControl(type: string, rowData?: any, parentId?: any): void {
    const request = new DataEpaymentRequestPayload();
    request.type = type;

    // Control Dự án cha, con
    if (type === MasterDataTypes.Projects && rowData && rowData.organizationId) {
      request.organizationId = rowData.organizationId;
      request.budgetPeriod = this.paymentOrderData.budgetPeriodNumber;
      request.parentId = parentId;
    }
    // Control loại ngân sách
    if (type === MasterDataTypes.ProjectBudgets && rowData && rowData.projectId) {
      request.projectId = rowData.projectId;
    }
    // Get data
    const temp = this.dataEpaymentService.selectMasterData(request).subscribe(res => {
      if (res) {

        if (type === MasterDataTypes.Organizations) {
          this.organizationsData = res.map(x => {
            x.Search_label = `${x.Filter} ${'-'} ${x.Name}`;
            return x;
          });
        }

        if (type === MasterDataTypes.Projects) {
          if (!parentId) {
            // Get dữ liệu dự án cha
            this.projectParentData = res;
          } else {
            // Get dữ liệu dự án con
            this.projectChilData = res;
          }
        }

        if (type === MasterDataTypes.ProjectBudgets) {
          this.budgetTypeData = res;
        }
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(temp);
  }

  public initData(): void {
    const requestExpensePayment = new ExpensePaymentRequestPayload();
    requestExpensePayment.expenseId = this.currentExpenseId;
    const temp = this.expensePaymentService.select(requestExpensePayment).subscribe(res => {
      if (res) {
        this.paymentData = res;
        const projectParentTemp = [];
        const projectChilTemp = [];
        for (const item of this.paymentData) {
          if (projectParentTemp.length === 0 || !projectParentTemp.find(x => x.Id === item.parentProjectId)) {
            projectParentTemp.push({ Id: item.parentProjectId, Code: item.parentProjectName });
          }
          if (projectChilTemp.length === 0 || !projectChilTemp.find(x => x.Id === item.projectId)) {
            projectChilTemp.push({ Id: item.projectId, Code: item.projectName });
          }
        }
        this.projectParentData = projectParentTemp;
        this.projectChilData = projectChilTemp;
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(temp);
  }

  public onBtnDeleteClick(rowData: any): void {
    const index = this.paymentData.findIndex(x => x.id === rowData.id);
    if (index > -1) {
      this.paymentData.splice(index, 1);
      let i = 1;
      for (const item of this.paymentData) {
        item.indexNo = 1;
        i++;
      }
      this.cdr.detectChanges();
    }
  }

  public addItemNew(): void {
    if (this.paymentData && this.paymentData.length > 0) {
      this.addPayment = { ...this.addPayment, indexNo: this.paymentData.length + 1 };
      this.paymentData.push(this.addPayment);
    } else {
      this.addPayment = { ...this.addPayment, indexNo: 1 };
      this.paymentData = [];
      this.paymentData.push(this.addPayment);
    }
    this.addPayment = { id: Guid.create().toString(), exchangeRate: 1, exchangeCurrency: 'VND' };
    this.onRowEditInit();
    this.cdr.detectChanges();
  }

  public onChangeAuthorizedPayment(rowData: any, event: any) {
    this.onRowEditInit();
    rowData.authorizedPayment = event.checked ? 1 : 0;
    // this.editRow.emit();
  }

  public onChangeOrganizationsData(event: any, rowData: any): void {
    if (event) {
      rowData.organizationId = event.Id;
      rowData.organizationName = event.Filter + ' - ' + event.Name;

      rowData.parentProjectId = null;
      rowData.parentProjectName = null;
      rowData.projectBudgetName = null;
      rowData.projectBudgetId = null;
    } else {
      rowData.organizationId = null;
      rowData.organizationName = null;
    }
    if (this.form) {
      this.form.form.markAsDirty();
    }
  }

  public onChangeParentProject(event: any, rowData: any) {
    if (event) {
      rowData.parentProjectId = event.Id;
      rowData.parentProjectName = event.Code;

      rowData.projectId = null;
      rowData.projectName = null;
      rowData.projectBudgetId = null;
      rowData.projectBudgetName = null;
    } else {
      rowData.parentProjectId = null;
      rowData.parentProjectName = null;
    }
    if (this.form) {
      this.form.form.markAsDirty();
    }
  }

  public onChangeProject(event: any, rowData: any) {
    if (event) {
      rowData.projectId = event.Id;
      rowData.projectName = event.Code;

      rowData.projectBudgetId = null;
      rowData.projectBudgetName = null;
    } else {
      rowData.projectId = null;
      rowData.projectName = null;
    }
    if (this.form) {
      this.form.form.markAsDirty();
    }
  }

  public onChangeProjectBudget(event: any, rowData: any) {
    if (event) {
      rowData.projectBudgetId = event.Id;
      rowData.projectBudgetName = event.MasterBudgetEntity.Code;
    } else {
      rowData.projectBudgetId = null;
      rowData.projectBudgetName = null;
    }
    if (this.form) {
      this.form.form.markAsDirty();
    }
  }

  public onRowEditInit(): void {
    if (this.form) {
      this.form.form.markAsDirty();
    }
    this.getTotal();
  }

  public getTotal(): void {
    // Xử lý table thanh toán trả trước
    if (this.paymentOrderData && this.type === 1) {
      let total = 0;
      this.paymentData.map(x => {
        if (x.price) {
          const price = +x.price.replaceAll(',', '');
          total += +price;
        }
      });
      this.paymentOrderData.convertedTotal = total;
      this.paymentOrderData.convertedSubTotal = total;
    }
    // Xử lý table tạm ứng
    if (this.paymentOrderData && this.type === 2) {
      let total = 0;
      this.paymentData.map(x => {
        if (x.price) {
          const price = +x.price.replaceAll(',', '');
          total += +price;
        }
      });
      this.paymentOrderData.convertedTotal = total;
      this.paymentOrderData.convertedSubTotal = total;
    }

  }

  public onChangePrice(rowData: any, event: any): void {
    if (event) {
      rowData.price = event < 0 ? 0 : event.target.value;
      rowData.convertedPrice = rowData.price;
      this.onRowEditInit();
    }
  }

  public onChangeContractAmount(rowData: any, event: any): void {
    if (event) {
      rowData.contractAmount = event < 0 ? 0 : event.target.value;
      this.onRowEditInit();
    }
  }

  public onChangeCurrency(currencyDto: any, rowData: any): void {
    if (currencyDto) {
      rowData.exchangeCurrency = currencyDto.code;
      this.onRowEditInit();
    }
  }

  public onChangeConvertedPrice(rowData: any, event: any): void {
    // Todo
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
