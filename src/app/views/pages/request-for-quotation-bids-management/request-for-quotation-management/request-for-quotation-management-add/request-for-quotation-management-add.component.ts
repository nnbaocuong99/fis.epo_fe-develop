import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { QuotationService } from '../../../../../services/modules/quotation/quotation.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { SaveConfirmation } from '../../../../../services/common/confirmation';
import * as configParent from '../../request-for-quotation-management/request-for-quotation-management.config';
import { forkJoin } from 'rxjs';
import { QuotationItemRequestPayload } from '../../../../../services/modules/quotation-item/quotation-item.request-payload';
import { QuotationItemService } from '../../../../../services/modules/quotation-item/quotation-item.service';
import { AppState } from '../../../../../core/reducers';
import { Store } from '@ngrx/store';
import { currentUser } from '../../../../../core/auth';
import { take } from 'rxjs/operators';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { SupplierRequestPayload } from '../../../../../services/modules/category/supplier/supplier.request.payload';
import {
  OperatingUnitService
} from '../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import {
  OperatingUnitRequestPayload
} from '../../../../../services/modules/category/organization-management/operating-unit/operating-unit.request.payload';
import { DepartmentRequestPayload } from '../../../../../services/modules/category/department/department.request.payload';
import { DepartmentService } from '../../../../../services/modules/category/department/department.service';
import { QuotationSupplierService } from '../../../../../services/modules/quotation-supplier/quotation-supplier.service';
import { QuotationSupplierRequestPayload } from '../../../../../services/modules/quotation-supplier/quotation-supplier.request-payload';
import { FileRequestPayload } from '../../../../../services/modules/file/file.request.payload';
import { FileService } from '../../../../../services/modules/file/file.service';
import { Guid } from 'guid-typescript';
import { ViewEnterQuoteDialogComponent } from './view-enter-quote-dialog/view-enter-quote-dialog.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-request-for-quotation-management-add',
  templateUrl: './request-for-quotation-management-add.component.html',
  styleUrls: ['./request-for-quotation-management-add.component.scss']
})
export class RequestForQuotationManagementAddComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('viewEnterQuoteDialogComponent', { static: false }) viewEnterQuoteDialogComponent: ViewEnterQuoteDialogComponent;

  @Input() titleForm = 'Thêm thông tin báo giá';
  @Input() hasEdit = true;

  public mainConfig = mainConfig.MAIN_CONFIG;

  public quotationData: any = {
    listQuotationSupplier: [],
    listQuotationItem: [],

    listQuotationSupplierDeleteId: [],
    listQuotationItemDeleteId: [],
  };

  public supplierRequestPayload = new SupplierRequestPayload();
  public operatingUnitRequestPayload = new OperatingUnitRequestPayload();
  public departmentRequestPayload = new DepartmentRequestPayload();
  public requestFile = new FileRequestPayload();
  public addQuotationItem: any = { id: Guid.create().toString().split('-').join('') };
  public addQuotationSupplier: any = { id: Guid.create().toString().split('-').join('') };
  public headerQuotationItem = configParent.QUOTATION_ITEM;
  public headerQuotationSupplier = configParent.QUOTATION_SUPPLIER;
  public headerQuotationItemEnterQuote = configParent.QUOTATION_ITEM_ENTER_QUOTE;
  public validateFields = configParent.VALIDATE_FIELD;
  public validateFieldsQuotationSupplier = configParent.VALIDATE_FIELD_CONDITIONS_SUPPLIER;

  public headerSuppliers = configParent.HEADER_SUPPLIER;
  public headerOperatingUnit = configParent.HEADER_OPERATING_UNIT;
  public headerDepartment = configParent.HEADER_DEPARMENT;
  public statusQuotationSupplier = configParent.STATUS_QUOTATION_SUPPILER;

  public currentQuotationId: string;


  public useNameLoginData: any = {};
  public hasDirectSave = true;

  constructor(
    public cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    public notification: NotificationService,
    public departmentService: DepartmentService,
    public quotationService: QuotationService,
    public quotationItemService: QuotationItemService,
    public quotationSupplierService: QuotationSupplierService,
    public currencyService: CurrencyService,
    public supplierService: SupplierService,
    public fileService: FileService,
    public operatingUnitService: OperatingUnitService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {

    this.store.select(currentUser).pipe(take(1)).subscribe(user => {
      this.useNameLoginData = user;
      this.iniConfig();
    });
  }

  public iniConfig(): void {
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        if (this.hasEdit === true) {
          this.titleForm = 'Sửa báo giá';
        }
        this.currentQuotationId = params.id;
        this.intData(this.currentQuotationId);
      } else {
        // default người gửi báo giá là người đăng nhập
        this.quotationData.requestPeople = this.useNameLoginData.email;
        this.hasDirectSave = false;
      }
    });
    this.subscriptions.push(routeSub);
  }

  public intData(id?: string): void {
    const quotationId = id ? id : this.currentQuotationId;
    // Get danh Sách NCC báo giá
    const requestQuotationSupplier = new QuotationSupplierRequestPayload();
    requestQuotationSupplier.requestForQuotationId = quotationId;
    // Get danh Sách sản phẩm báo giá
    const requestQuotationItem = new QuotationItemRequestPayload();
    requestQuotationItem.requestForQuotationId = quotationId;

    const initSub = forkJoin([
      this.quotationService.selectById(quotationId),
      this.quotationItemService.select(requestQuotationItem),
      this.quotationSupplierService.select(requestQuotationSupplier),
    ]).subscribe(res => {
      if (res[0]) {
        this.quotationData = res[0];
        this.quotationDataDto(this.quotationData);

        this.quotationData.listQuotationItemDeleteId = [];
        this.quotationData.listQuotationSupplierDeleteId = [];

        this.quotationData.listQuotationItem = res[1];
        this.quotationData.listQuotationSupplier = res[2];
        this.quotationData.listQuotationSupplier.map(x => {
          x.quotePeopleEmailItems = x.quotePeopleEmail ? x.quotePeopleEmail.split(',') : [];
        });
      } else {
        this.goBack();
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(initSub);
  }

  public quotationDataDto(source: any): void {
    this.quotationData.requestCompanyDto = this.toDto('code', source.requestCompany);
    this.quotationData.subDepartmentDto = this.toDto('name', source.subDepartmentName);
  }

  public goBack(): void {
    this.router.navigate([`rfq`], { relativeTo: this.route.parent });
  }

  public goToEdit(): void {
    this.router.navigate([`rfq/quotation/edit/${this.quotationData.id}`], { relativeTo: this.route.parent });
  }

  public onChangeSupplierRowData(event?: any, rowData?: any): void {
    if (event && event.name) {
      rowData.supplierId = event.id;
      rowData.supplierName = event.name;
      this.editForm();
    } else {
      rowData.supplierId = null;
      rowData.supplierName = null;
    }
  }

  public onChangeSupplier(event?: any): void {
    if (event && event.name) {
      this.addQuotationSupplier.supplierId = event.id;
      this.addQuotationSupplier.code = event.code;
      this.addQuotationSupplier.supplierName = event.name;
      this.addQuotationSupplier.quotePeopleEmail = event.email;
      this.addQuotationSupplier.quotePeopleEmailItems =
        this.addQuotationSupplier.quotePeopleEmail ? this.addQuotationSupplier.quotePeopleEmail.split(',') : [];
    } else {
      this.addQuotationSupplier.supplierId = null;
      this.addQuotationSupplier.supplierName = null;
    }
  }

  public addTagFn(name: string) {
    return name;
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-quotation')) {
        this.notification.showMessage('VALIDATION.FORM_VALID');
        return;
      }

      if (this.quotationData.listQuotationSupplier && this.quotationData.listQuotationSupplier.length === 0) {
        this.notification.showWarning('Vui lòng thêm ít nhất 1 nhà cung cấp !!');
        return;
      }

      if (this.quotationData.listQuotationItem && this.quotationData.listQuotationItem.length === 0) {
        this.notification.showWarning('Vui lòng thêm ít nhất 1 sản phẩm!!');
        return;
      }

      if (this.quotationData.listQuotationSupplier && this.quotationData.listQuotationSupplier.length > 0) {
        if (this.quotationData.listQuotationSupplier.find(x => x.status === 2)) {
          this.notification.showWarning('Không thể sửa do đã có NCC thực hiện báo giá');
          return;
        }
      }

      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          // Import file form thêm
          if (!this.hasDirectSave && this.requestFile && this.requestFile.newFile) {
            let guideId: any = Guid.create().toString();
            guideId = guideId.split('-').join('');
            this.requestFile.module = 'Attachment\\QuotationFile\\' + guideId;
            this.quotationData.id = guideId;
            this.fileService.upload(this.requestFile.newFile.value, this.requestFile).subscribe(res => {
            });
          }

          if (!this.currentQuotationId) {
            // trạng thái báo giá mới tạo
            this.quotationData.status = 1;
          }
          const dataSave: any = {
            ...this.quotationData
          };
          this.quotationService.save(dataSave).subscribe(m => {
            if (m) {
              this.quotationData.id = m.id;
              this.form.form.markAsPristine();
              this.notification.showSuccess();
              this.goToView();
              // this.ngOnInit();
            }
          });
        };
        this.notification.confirm(saveConfirmation);
      } else {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  public onBtnCancelClick(): void {
    this.goBack();
  }

  public goToView(): void {
    this.router.navigate([`rfq/quotation/view/${this.quotationData.id}`], { relativeTo: this.route.parent });
  }

  public addNewRowQuotationSupplier(): void {
    if (this.validateNewRowQuotationSupplier()) {
      this.addQuotationSupplier.status = 1;
      this.addQuotationSupplier.quotePeopleEmailItems =
        this.addQuotationSupplier.quotePeopleEmail ? this.addQuotationSupplier.quotePeopleEmail.split(',') : [];
      if (this.quotationData.listQuotationSupplier && this.quotationData.listQuotationSupplier.length > 0
        && this.quotationData.listQuotationSupplier.find(x => x.supplierId === this.addQuotationSupplier.supplierId)) {
        this.notification.showWarning('Không thể thêm 2 NCC giống nhau');
        return;
      } else {
        this.quotationData.listQuotationSupplier.push(this.addQuotationSupplier);
      }

      this.addQuotationSupplier = { id: Guid.create().toString().split('-').join('') };
      this.addQuotationSupplier.supplierIdDto = '';
      this.addQuotationSupplier.quotePeopleEmailItems = [];
      this.cdr.detectChanges();
      this.form.form.markAsDirty();
    }
  }

  public validateNewRowQuotationSupplier(): boolean {
    let result = true;
    for (const item of this.validateFieldsQuotationSupplier) {
      if (item.validateValue.some(x => x === this.addQuotationSupplier[item.field])) {
        this.notification.showMessage(item.message);
        result = false;
        break;
      }
    }
    return result;
  }

  public deleteRowQuotationSupplier(indexRow: any): void {
    const temp = this.quotationData.listQuotationSupplier.find((element, index) => index === indexRow);
    if (temp.id) {
      this.quotationData.listQuotationSupplierDeleteId.push(temp.id);
    }
    this.quotationData.listQuotationSupplier = this.quotationData.listQuotationSupplier.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public addNewRowQuotationItem(): void {
    if (this.validateNewRowQuotationItem()) {
      this.quotationData.listQuotationItem.push(this.addQuotationItem);
      this.getIndexNo();
      this.addQuotationItem = { id: Guid.create().toString().split('-').join('') };
      this.cdr.detectChanges();
      this.form.form.markAsDirty();
    }
  }

  public deleteRowQuotationItem(indexRow: any): void {
    const temp = this.quotationData.listQuotationItem.find((element, index) => index === indexRow);
    if (temp.id) {
      this.quotationData.listQuotationItemDeleteId.push(temp.id);
    }
    this.quotationData.listQuotationItem = this.quotationData.listQuotationItem.filter((element, index) => index !== indexRow);
    this.getIndexNo();
    this.form.form.markAsDirty();
  }

  private getIndexNo(): void {
    let index = 1;
    if (this.quotationData.listQuotationItem.length > 0) {
      for (const item of this.quotationData.listQuotationItem) {
        item.indexNo = index;
        index++;
      }
    } else {
      this.quotationData.listQuotationItem[0].indexNo = 1;
    }
  }

  public validateNewRowQuotationItem(): boolean {
    let result = true;
    for (const item of this.validateFields) {
      if (item.validateValue.some(x => x === this.addQuotationItem[item.field])) {
        this.notification.showMessage(item.message);
        result = false;
        break;
      }
    }
    return result;
  }

  public onViewEnterQuoteClick(rowData: any): void {
    this.viewEnterQuoteDialogComponent.onBtnShowDialogListClick(rowData);
    this.cdr.detectChanges();
  }

  public onChangeRequestCompany(event: any): void {
    if (event) {
      this.quotationData.requestCompany = event.code;
      this.departmentRequestPayload.ouId = event.ouId;
      this.editForm();
    } else {
      this.quotationData.requestCompany = null;
      this.departmentRequestPayload.ouId = null;
    }
  }

  public onChangeSubDepartmentId(event: any): void {
    if (event) {
      this.quotationData.subDepartmentId = event.subDepartmentId;
      this.editForm();
    }
  }

  public editForm(): void {
    if (this.form) {
      this.form.form.markAsDirty();
    }
  }

  public bindingDataToSave(event?: any): void {
    if (event) {
      this.requestFile = event;
    }
  }

}
