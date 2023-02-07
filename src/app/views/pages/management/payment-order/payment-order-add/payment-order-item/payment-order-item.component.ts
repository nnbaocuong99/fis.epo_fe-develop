import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as config from './payment-order-item.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { Guid } from 'guid-typescript';
import { DataEpaymentService } from '../../../../../../services/modules/data-ePayment/data-ePayment.service';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { SupplierRequestPayload } from '../../../../../../services/modules/category/supplier/supplier.request.payload';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PurchaseInvoiceRequestPayload } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { CurrencyRequestPayload } from '../../../../../../services/modules/category/currency/currency.request.payload';
import { ExpenseBillService } from '../../../../../../services/modules/expense-bill/expense-bill.service';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoiceItemService } from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { ExpensePaymentService } from '../../../../../../services/modules/expense-payment/expense-payment.service';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';
import { ExpenseBillRequestPayload } from '../../../../../../services/modules/expense-bill/expense-bill.request.payload';
import { ExpensePaymentRequestPayload } from '../../../../../../services/modules/expense-payment/expense-payment.request.payload';
import { DataEpaymentRequestPayload } from '../../../../../../services/modules/data-ePayment/data-ePayment-request-payload';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';

export enum InvoiceTypes {
  OtherInvoice = 'Other Invoice',
  PrePaymentInvoice = 'PrePayment Invoice',
  PurchaseInvoice = 'Purchase Invoice'
}

export enum MasterDataTypes {
  Organizations = 'Organizations',
  BillTypes = 'BillTypes',
  TaxTypes = 'TaxTypes',
  Projects = 'Projects',
  ProjectBudgets = 'ProjectBudgets'
}
@Component({
  selector: 'app-payment-order-item',
  templateUrl: './payment-order-item.component.html',
  styleUrls: ['./payment-order-item.component.scss']
})
export class PaymentOrderItemComponent extends BaseFormComponent implements OnInit {
  @Input() form: any;
  @Input() hasEdit = true;
  @Input() organizationsData = [];
  @Input() paymentOrderData: any;
  // @Input() purchaseinvoice: any;

  _purchaseinvoice: any;
  get purchaseinvoice(): any {
    return this._purchaseinvoice;
  }
  @Input() set purchaseinvoice(data: any) {
    this._purchaseinvoice = data;
    if (this.purchaseinvoice) {
      if (!this.dataSource.items || this.dataSource.items === 0) {
        this.addBillNew();
      }
      if (this.billTypesData && this.billTypesData.length > 0) {
        this.bindingDataPurchaseInvoiceToTabel(this.dataSource.items[0], this.purchaseinvoice);
      } else {
        const request = new DataEpaymentRequestPayload();
        request.type = MasterDataTypes.BillTypes;
        const temp = this.dataEpaymentService.selectMasterData(request).subscribe(res => {
          if (res) {
            this.billTypesData = res;
            this.bindingDataPurchaseInvoiceToTabel(this.dataSource.items[0], this.purchaseinvoice);
            this.cdr.detectChanges();
          }
        });
        this.subscriptions.push(temp);
      }
    }
  }
  @Input() purchaseInvoiceItem: any;

  public purchaseInvoiceRequestPayload = new PurchaseInvoiceRequestPayload();
  public currencyRequestPayload = new CurrencyRequestPayload();
  public headerPurchaseInvoice = config.HEADER_PURCHASE_INVOICE;
  public headers = config.HEADER_BILL;
  public paymentHeaders = config.HEADER_PAYMENT;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public headerSuppliers = config.HEADER_SUPPLIER;
  public headerCurrency = config.HEADER_CURRENCY;

  public currentExpenseId: string;
  public currentPiId: string;
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public supplierRequestPayload = new SupplierRequestPayload();
  public addBill: any = { id: Guid.create().toString(), exchangeCurrency: 'VND', exchangeRate: 1 };
  public billTypesData = [];
  public taxTypesData = [];
  public projectParentData = [];
  public projectChilData = [];
  public budgetTypeData = [];

  constructor(
    public expenseBillService: ExpenseBillService,
    public purchaseInvoiceService: PurchaseInvoiceService,
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    public expensePaymentService: ExpensePaymentService,
    public dataEpaymentService: DataEpaymentService,
    public supplierService: SupplierService,
    public currencyService: CurrencyService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.getMasterDataControl(MasterDataTypes.BillTypes);
    this.getMasterDataControl(MasterDataTypes.TaxTypes);
    const routeSub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.currentExpenseId = params.id;
        this.initData();
      } else {
        if (!this.dataSource.items || this.dataSource.items === 0) {
          this.addBillNew();
        }
      }
    });
    this.subscriptions.push(routeSub);
  }

  public getMasterDataControl(type: string, rowData?: any, parentId?: any): void {
    const request = new DataEpaymentRequestPayload();
    request.type = type;

    // Control thuế
    if (type === MasterDataTypes.TaxTypes && rowData && rowData.billTypeId) {
      request.billTypeId = rowData.billTypeId;
    }
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
          // Fix search control
          this.organizationsData = res.map(x => {
            x.Search_label = `${x.Filter} ${'-'} ${x.Name}`;
            return x;
          });
        }

        if (type === MasterDataTypes.BillTypes) {
          this.billTypesData = res;
        }

        if (type === MasterDataTypes.TaxTypes) {
          this.taxTypesData = res;
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

  public bindingDataPurchaseInvoiceToTabel(rowData: any, source: any): void {
    if (source.code) {
      const poCode = source.poCode ? source.poCode : source.strPoCode;
      rowData.content = poCode ? ('Thanh toán cho hợp đồng [' + poCode + ']') : null;
      rowData.supplierTax = source.supplierTax;
      rowData.vendorId = source.vendorId;
      rowData.supplierName = source.supplierName;
      // rowData.content = source.code;
      rowData.description = source.invoiceDesc ? source.invoiceDesc + '->' + source.code : null;
      rowData.formNo = source.symbol;
      rowData.seri = source.seriNo;
      rowData.number = source.code;
      rowData.createdDate = source.date;
      rowData.exchangeCurrency = source.currency;

      if (source.invoiceType === InvoiceTypes.OtherInvoice) {
        rowData.billTypeName = 'Hóa đơn nhập khẩu';
      }

      if (source.invoiceType === InvoiceTypes.PurchaseInvoice) {
        rowData.billTypeName = 'Hóa đơn tài chính';
      }

      for (const item of this.billTypesData) {
        if (item.Name === rowData.billTypeName) {
          rowData.billTypeId = item.Id;
        }
      }

      if (rowData.paymentData && rowData.paymentData.length === 1) {
        const paymentRow = rowData.paymentData[0];
        paymentRow.quantity = 1;

        if (source.totalRemain) {
          paymentRow.unitPrice = source.totalRemain;
          paymentRow.price = source.totalRemain;
        } else {
          paymentRow.unitPrice = source.totalAmount;
          paymentRow.price = source.totalAmount;
        }
        if (rowData.exchangeCurrency === 'VND') {
          paymentRow.price = paymentRow.price.toFixed(0);
          paymentRow.unitPrice = paymentRow.unitPrice.toFixed(0);
        }
        paymentRow.taxAmount = source.taxAmount ? source.taxAmount : 0;
        paymentRow.convertedPrice = paymentRow.price;
        paymentRow.totalPrice = paymentRow.price + paymentRow.taxAmount;
        paymentRow.convertedTotalPrice = paymentRow.price + paymentRow.taxAmount;
        this.calculateDataTable();
        this.getTotal();
      }

      this.convertToDto(rowData);
    }
  }

  public convertToDto(source: any): void {
    source.supplierTaxDto = source.supplierTax;
    source.numberDto = source.number;
    // source.supplierCodeDto = this.toDto('userName', source.supplierCode);
    this.cdr.detectChanges();
  }

  public onChangeInvoiceNumber(rowData: any, event: any): void {
    if (event) {
      const index = this.dataSource.items.findIndex(x => x.number === event.code);
      if ((!rowData.number || rowData.number !== event.code) && index > -1) {
        this.notificationService.showError("Số hóa đơn chọn đã tồn tại");
        setTimeout(() => {
          this.convertToDto(rowData);
        }, 50);
        return;
      }
      const source = this.dataSource.items.filter(x => x.vendorId && x.vendorId !== event.vendorId);
      if (this.dataSource.items.length > 1 && source.length > 0) {
        this.notificationService.showError("Vui lòng chọn cùng một nhà cung cấp");
        setTimeout(() => {
          this.convertToDto(rowData);
        }, 50);
        return;
      }
      this.bindingDataPurchaseInvoiceToTabel(rowData, event);
    }
  }

  public initData(): void {
    const requestExpenseBill = new ExpenseBillRequestPayload();
    requestExpenseBill.expenseId = this.currentExpenseId;
    const requestExpensePayment = new ExpensePaymentRequestPayload();
    requestExpensePayment.expenseId = this.currentExpenseId;
    const temp = forkJoin([
      this.expenseBillService.select(requestExpenseBill),
      this.expensePaymentService.select(requestExpensePayment)
    ]).subscribe(res => {
      if (res[0] && res[0].length > 0) {
        this.dataSource.items = res[0];
        this.dataSource.items.map(x => {
          x.indexNo = +x.indexNo;
          this.convertToDto(x);
          if (x.taxTypeName) {
            x.taxValue = this.getTaxValue(x.taxTypeName);
          }
        });
        this.dataSource.paginatorTotal = res[0].length;
        const projectParentTemp = [];
        const projectChilTemp = [];
        const budgetTypeTemp = [];
        for (const item of this.dataSource.items) {
          item.paymentData = res[1].filter(x => x.billId === item.id);
          item.paymentData.map(x => {
            if (x.taxTypeName) {
              x.taxValue = this.getTaxValue(x.taxTypeName);
            }
            if (projectParentTemp.length === 0 || !projectParentTemp.find(obj => obj.Id === x.parentProjectId)) {
              projectParentTemp.push({ Id: x.parentProjectId, Code: x.parentProjectName });
            }
            if (projectChilTemp.length === 0 || !projectChilTemp.find(obj => obj.Id === x.projectId)) {
              projectChilTemp.push({ Id: x.projectId, Code: x.projectName });
            }
            if (budgetTypeTemp.length === 0 || !budgetTypeTemp.find(obj => obj.Id === x.projectBudgetId)) {
              budgetTypeTemp.push({ Id: x.projectBudgetId, MasterBudgetEntity: { Code: x.projectBudgetName } });
            }
          });
        }
        this.projectParentData = projectParentTemp;
        this.projectChilData = projectChilTemp;
        this.budgetTypeData = budgetTypeTemp;
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(temp);
  }

  // 1: Bill, 2: Payment
  public onBtnDeleteClick(rowData: any, type: number): void {
    if (type === 1) {
      const findIndex = this.dataSource.items.findIndex(x => x.id === rowData.id);
      if (findIndex > -1) {
        this.dataSource.items.splice(findIndex, 1);
        this.getIndexNo();
      }
    }
    if (type === 2) {
      const findIndex = this.dataSource.items.findIndex(x => x.id === rowData.billId);
      if (findIndex > -1) {
        const index = this.dataSource.items[findIndex].paymentData.findIndex(x => x.indexNo === rowData.indexNo);
        if (index > -1) {
          this.dataSource.items[findIndex].paymentData.splice(index, 1);
          this.getIndexNo();
        }
      }
    }
  }

  private getIndexNo(): void {
    let i = 1;
    for (const item of this.dataSource.items) {
      item.indexNo = i;
      item.paymentData.forEach((element, index) => {
        element.indexNo = item.indexNo + '.' + (index + 1);
      });
      i++;
    }
  }

  public addPaymentNew(rowData: any): void {
    const index = this.dataSource.items.findIndex(x => x.id === rowData.id);
    if (index > -1) {
      const paymentIndexNo = this.dataSource.items[index].indexNo + '.' +
        // tslint:disable-next-line:max-line-length
        (+this.dataSource.items[index].paymentData[this.dataSource.items[index].paymentData.length - 1].indexNo.toString().split('.')[1] + 1);
      const paymentItem = { id: Guid.create().toString(), billId: this.dataSource.items[index].id, indexNo: paymentIndexNo };
      this.dataSource.items[index].paymentData.push(paymentItem);
    }
    this.cdr.detectChanges();
  }

  public addBillNew(): void {
    this.addBill = { id: Guid.create().toString(), exchangeCurrency: 'VND', exchangeRate: 1 };
    if (this.dataSource.items && this.dataSource.items.length > 0) {
      const paymentData = [
        { id: Guid.create().toString(), billId: this.addBill.id, indexNo: (this.dataSource.items.length + 1 + '.1') }
      ];
      this.addBill = { ...this.addBill, indexNo: this.dataSource.items.length + 1, paymentData };
      this.dataSource.items.push(this.addBill);
    } else {
      const paymentData = [
        { id: Guid.create().toString(), billId: this.addBill.id, indexNo: 1.1 }
      ];
      this.addBill = { ...this.addBill, indexNo: 1, paymentData };
      this.dataSource.items = [];
      this.dataSource.items.push(this.addBill);
    }
    this.onRowEditInit();
    this.cdr.detectChanges();
  }

  public onChangeBillTypesData(event: any, rowData: any): void {
    if (event) {
      rowData.billTypeId = event.Id;
      rowData.billTypeName = event.Name;
      this.getMasterDataControl(MasterDataTypes.TaxTypes, rowData);
    }
    this.onRowEditInit();
  }

  public onChangeAuthorizedPayment(rowData: any, event: any) {
    this.onRowEditInit();
    rowData.authorizedPayment = event.checked ? 1 : 0;
    // this.editRow.emit();
  }

  public onChangeSmSupplier(event: any, rowData: any): void {
    this.onRowEditInit();
    if (event) {
      rowData.supplierCode = event.taxCode;
      rowData.supplierName = event.name;
    }
  }

  public onRowEditInit(): void {
    if (this.form) {
      this.form.form.markAsDirty();
    }
    this.calculateDataTable();
    this.getTotal();
  }

  public getTotal(): void {
    if (this.dataSource.items && this.dataSource.items.length > 0) {
      let total = 0;
      let subTotal = 0;
      this.dataSource.items.map(x => {
        if (x.total) {
          const totalTemp = this.checkNumber(x.total) ? +x.total.replaceAll(',', '') : +x.total;
          total += +totalTemp;
        }
        if (x.subTotal) {
          const subTotalTemp = this.checkNumber(x.subTotal) ? +x.subTotal.replaceAll(',', '') : +x.subTotal;
          subTotal += +subTotalTemp;
        }
      });
      this.paymentOrderData.convertedSubTotal = subTotal;
      this.paymentOrderData.convertedTotal = total;
      this.paymentOrderData.unpaidAmount = total;
    }
  }

  public onChangeTaxType(event: any, rowData: any): void {
    if (event) {
      rowData.taxTypeId = event.Id;
      rowData.taxTypeName = event.Name;
      rowData.taxValue = this.getTaxValue(rowData.taxTypeName);
      if (rowData.billId) {
        // Xử lý item payment
        rowData.taxAmount = (rowData.price * rowData.taxValue) / 100;
        rowData.totalPrice = rowData.taxAmount ? rowData.taxAmount + rowData.price : rowData.price;
        rowData.convertedTotalPrice = rowData.totalPrice;
        this.onRowEditInit();
      } else {
        rowData.taxAmount = (rowData.subTotal * rowData.taxValue) / 100;
        rowData.total = rowData.subTotal + rowData.taxAmount;
        this.getTotal();
        if (this.form) {
          this.form.form.markAsDirty();
        }
      }
    } else {
      rowData.taxTypeId = null;
      rowData.taxTypeName = null;
      rowData.taxAmount = null;
      if (rowData.billId) {
        rowData.totalPrice = rowData.price;
        rowData.convertedTotalPrice = rowData.totalPrice;
        this.onRowEditInit();
      } else {
        rowData.total = rowData.subTotal;
        this.getTotal();
        if (this.form) {
          this.form.form.markAsDirty();
        }
      }
    }
  }

  public getTaxValue(str: string): number {
    let value = 0;
    // Get số trong chuỗi
    const indexEnd = str.lastIndexOf('%');
    if (indexEnd !== -1) {
      const indexStart = str.indexOf(str.match(/[0-9]/)[0]);
      value = +str.slice(indexStart, indexEnd);
    }
    return value;
  }

  public onChangeTaxAmount(row: any, event: any): void {
    if (event && row.billId) {
      row.taxAmount = event < 0 ? 0 : event.target.value;
      const taxAmount = this.checkNumber(row.taxAmount) ? +row.taxAmount.replaceAll(',', '') : +row.taxAmount;
      row.totalPrice = row.taxAmount ? taxAmount + (+row.price) : row.price;
      row.convertedTotalPrice = row.totalPrice;
    }
    this.onRowEditInit();
  }

  public onChangeOrganizationsData(event: any, rowData: any): void {
    if (event) {
      rowData.organizationId = event.Id;
      rowData.organizationName = event.Filter + ' - ' + event.Name;

      rowData.parentProjectId = null;
      rowData.parentProjectName = null;
      rowData.projectId = null;
      rowData.projectName = null;
      rowData.projectBudgetId = null;
      rowData.projectBudgetName = null;
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

  public onChangeSubTotal(rowData: any, event: any): void {
    // Todo
  }

  public onChangeQuantity(row: any, event: any): void {
    if (event) {
      if (row.quantity && row.unitPrice) {
        const unitPrice = this.checkNumber(row.unitPrice) ? +row.unitPrice.replaceAll(',', '') : +row.unitPrice;
        row.price = row.quantity * unitPrice;
        row.convertedPrice = row.price;
        row.taxAmount = row.taxValue ? (row.taxValue * row.price) / 100 : null;

        row.totalPrice = row.taxAmount ? row.taxAmount + row.price : row.price;
        row.convertedTotalPrice = row.totalPrice;
      }
      this.onRowEditInit();
    }
  }

  public onChangeUnitPrice(row: any, event: any): void {
    if (event) {
      row.unitPrice = event < 0 ? 0 : event.target.value;
      if (row.quantity) {
        const unitPrice = this.checkNumber(row.unitPrice) ? +row.unitPrice.replaceAll(',', '') : +row.unitPrice;
        row.price = row.quantity * unitPrice;
        row.convertedPrice = row.price;
        row.taxAmount = row.taxValue ? (row.taxValue * row.price) / 100 : null;

        row.totalPrice = row.taxAmount ? row.taxAmount + row.price : row.price;
        row.convertedTotalPrice = row.totalPrice;
      }
      this.onRowEditInit();
    }
  }

  // Tính giá trị tổng cho invoice
  public calculateDataTable(): void {
    for (const item of this.dataSource.items) {
      let total = 0;
      let subTotal = 0;
      let taxAmount = 0;
      item.paymentData.map(x => {
        if (x.price) {
          const price = this.checkNumber(x.price) ? +x.price.replaceAll(',', '') : +x.price;
          subTotal += +price;
        }
        if (x.taxAmount) {
          const taxAmountTemp = this.checkNumber(x.taxAmount) ? +x.taxAmount.replaceAll(',', '') : +x.taxAmount;
          taxAmount += +taxAmountTemp;
        }
        if (x.totalPrice) {
          const totalPrice = this.checkNumber(x.totalPrice) ? +x.totalPrice.replaceAll(',', '') : +x.totalPrice;
          total += +totalPrice;
        }
      });
      item.subTotal = subTotal;
      item.taxAmount = taxAmount;
      item.total = total;
    }
  }

  public onChangeCurrency(currencyDto: any, rowData: any): void {
    if (currencyDto) {
      rowData.exchangeCurrency = currencyDto.code;
      this.onRowEditInit();
    }
  }

  public checkNumber(price: any): boolean {
    if (price && price.toString().indexOf(',') === -1) {
      // Không tìm thấy
      return false;
    } else {
      return true;
    }
  }

  public convertCurrencyMask(price: any, currency: string): string {
    if (price !== null && price !== undefined) {
      let result = '';
      if (currency === 'VND') {
        result = this.format(price, 0, 3, ',', '.');
      } else {
        result = this.format(price, 2, 3, ',', '.');
      }
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
